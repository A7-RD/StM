"use client"

import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type RefObject,
} from "react"

import {
  HERO_BASE_OFFSET,
  HERO_BASE_SVG,
  HERO_HIGHLIGHT_LAYER_SVG,
  HERO_MASK_IMAGE,
  HERO_SHADOW_LAYER_SVG,
  HERO_VIEW_HEIGHT,
  HERO_VIEW_WIDTH,
} from "./heroSvgMarkup"

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

const NY_TOP_GAIN = 0.1
const NY_BOTTOM_GAIN = 1.95
const MAX_DY_POSITIVE = 1.95
const MAX_DY_NEGATIVE = 3.85
const MAX_OFFSET = 2.5
const HIGHLIGHT_GAIN = 0.9
const ORIENTATION_SENS_DEG = 22
const LERP_FACTOR = 0.18
const SETTLE_EPSILON = 0.01

function lightingDeltas(nx: number, ny: number) {
  const radial = Math.hypot(nx, ny)
  const cornerScale = radial < 1e-6 ? 1 : Math.min(1, 1 / radial)
  const nyWeighted = ny <= 0 ? ny * NY_TOP_GAIN : ny * NY_BOTTOM_GAIN
  return {
    dx: clamp(-nx * MAX_OFFSET * cornerScale, -MAX_OFFSET, MAX_OFFSET),
    dy: clamp(
      -nyWeighted * MAX_OFFSET * cornerScale,
      -MAX_DY_NEGATIVE,
      MAX_DY_POSITIVE,
    ),
  }
}

const maskStyle: CSSProperties = {
  maskImage: HERO_MASK_IMAGE,
  maskSize: "100% 100%",
  WebkitMaskImage: HERO_MASK_IMAGE,
  WebkitMaskSize: "100% 100%",
}

type HeroGraphicProps = {
  heroRef?: RefObject<HTMLDivElement | null>
}

export default function HeroGraphic({ heroRef }: HeroGraphicProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const shadowLayerRef = useRef<HTMLDivElement | null>(null)
  const highlightLayerRef = useRef<HTMLDivElement | null>(null)
  const rectRef = useRef<DOMRect | null>(null)
  const scaleRef = useRef(1)
  const targetRef = useRef({ dx: 0, dy: 0 })
  const currentRef = useRef({ dx: 0, dy: 0 })
  const rafRef = useRef(0)
  const motionEnabledRef = useRef(false)

  // The blurred edge maps are static; lighting changes only translate them
  // (a compositor-only operation), so no filter work happens per frame.
  const applyOffsets = useCallback(() => {
    const scale = scaleRef.current
    const { dx, dy } = currentRef.current

    const shadow = shadowLayerRef.current
    if (shadow) {
      const sx = dx * scale
      const sy = (HERO_BASE_OFFSET + dy) * scale
      shadow.style.transform = `translate3d(${sx.toFixed(2)}px, ${sy.toFixed(2)}px, 0)`
    }
    const highlight = highlightLayerRef.current
    if (highlight) {
      const hx = -dx * HIGHLIGHT_GAIN * scale
      const hy = (-HERO_BASE_OFFSET - dy * HIGHLIGHT_GAIN) * scale
      highlight.style.transform = `translate3d(${hx.toFixed(2)}px, ${hy.toFixed(2)}px, 0)`
    }
  }, [])

  useEffect(() => {
    const el = heroRef?.current ?? hostRef.current
    if (!el) return

    function updateRect() {
      const node = heroRef?.current ?? hostRef.current
      if (!node) return
      rectRef.current = node.getBoundingClientRect()
      const wrapper = wrapperRef.current
      if (wrapper) {
        const width = wrapper.getBoundingClientRect().width
        if (width) scaleRef.current = width / HERO_VIEW_WIDTH
      }
      applyOffsets()
    }

    updateRect()
    window.addEventListener("resize", updateRect, { passive: true })
    window.addEventListener("scroll", updateRect, { passive: true })
    return () => {
      window.removeEventListener("resize", updateRect)
      window.removeEventListener("scroll", updateRect)
    }
  }, [heroRef, applyOffsets])

  const ensureRaf = useCallback(() => {
    if (rafRef.current) return

    function step() {
      rafRef.current = 0
      const target = targetRef.current
      const current = currentRef.current

      const nextDx = current.dx + (target.dx - current.dx) * LERP_FACTOR
      const nextDy = current.dy + (target.dy - current.dy) * LERP_FACTOR
      const settled =
        Math.abs(nextDx - target.dx) < SETTLE_EPSILON &&
        Math.abs(nextDy - target.dy) < SETTLE_EPSILON

      current.dx = settled ? target.dx : nextDx
      current.dy = settled ? target.dy : nextDy

      applyOffsets()

      if (!settled) {
        rafRef.current = requestAnimationFrame(step)
      }
    }

    rafRef.current = requestAnimationFrame(step)
  }, [applyOffsets])

  const resetToBaseline = useCallback(() => {
    targetRef.current = { dx: 0, dy: 0 }
    ensureRaf()
  }, [ensureRaf])

  useEffect(() => {
    const mqlFine = window.matchMedia("(hover: hover) and (pointer: fine)")
    const mqlReduce = window.matchMedia("(prefers-reduced-motion: reduce)")

    let baselineGamma: number | null = null
    let baselineBeta: number | null = null
    let orientationListening = false
    let gestureListenersActive = false

    function syncMotionEnabled() {
      motionEnabledRef.current = mqlFine.matches && !mqlReduce.matches
      if (!motionEnabledRef.current) resetToBaseline()
    }

    function onDeviceOrientation(e: DeviceOrientationEvent) {
      if (mqlFine.matches || mqlReduce.matches) return
      if (e.gamma == null || e.beta == null) return
      if (baselineGamma === null) {
        baselineGamma = e.gamma
        baselineBeta = e.beta
      }
      const nx = clamp(
        (e.gamma - baselineGamma) / ORIENTATION_SENS_DEG,
        -1,
        1,
      )
      const ny = clamp(
        (e.beta - (baselineBeta ?? 0)) / ORIENTATION_SENS_DEG,
        -1,
        1,
      )
      targetRef.current = lightingDeltas(nx, ny)
      ensureRaf()
    }

    function startOrientation() {
      if (orientationListening) return
      window.addEventListener("deviceorientation", onDeviceOrientation)
      orientationListening = true
    }

    function stopOrientation() {
      if (!orientationListening) return
      window.removeEventListener("deviceorientation", onDeviceOrientation)
      orientationListening = false
      baselineGamma = null
      baselineBeta = null
    }

    function iosOrientationNeedsPermission() {
      return (
        typeof DeviceOrientationEvent !== "undefined" &&
        "requestPermission" in DeviceOrientationEvent &&
        typeof (
          DeviceOrientationEvent as unknown as {
            requestPermission?: () => Promise<PermissionState>
          }
        ).requestPermission === "function"
      )
    }

    function removeGestureListeners() {
      if (!gestureListenersActive) return
      window.removeEventListener("touchstart", onUserGesture)
      window.removeEventListener("click", onUserGesture)
      gestureListenersActive = false
    }

    function onUserGesture() {
      removeGestureListeners()

      if (iosOrientationNeedsPermission()) {
        const DOE = DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<PermissionState>
        }
        void DOE.requestPermission?.()
          .then((permission) => {
            if (permission === "granted") startOrientation()
          })
          .catch(() => {})
      } else {
        startOrientation()
      }
    }

    function addGestureListeners() {
      if (gestureListenersActive) return
      window.addEventListener("touchstart", onUserGesture, { passive: true })
      window.addEventListener("click", onUserGesture)
      gestureListenersActive = true
    }

    function syncOrientation() {
      stopOrientation()
      removeGestureListeners()

      if (mqlReduce.matches || mqlFine.matches) {
        resetToBaseline()
        return
      }

      if (iosOrientationNeedsPermission()) {
        addGestureListeners()
      } else {
        startOrientation()
      }
    }

    function onMotionMediaChange() {
      syncMotionEnabled()
      syncOrientation()
    }

    function onPointerMove(e: PointerEvent) {
      if (!motionEnabledRef.current) return
      const rect = rectRef.current
      if (!rect || !rect.width || !rect.height) return

      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      if (!inside) {
        resetToBaseline()
        return
      }

      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1
      targetRef.current = lightingDeltas(nx, ny)
      ensureRaf()
    }

    function onVisibility() {
      if (document.visibilityState !== "visible") resetToBaseline()
    }

    syncMotionEnabled()
    syncOrientation()

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    window.addEventListener("blur", resetToBaseline)
    document.addEventListener("visibilitychange", onVisibility)
    mqlFine.addEventListener("change", onMotionMediaChange)
    mqlReduce.addEventListener("change", onMotionMediaChange)

    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("blur", resetToBaseline)
      document.removeEventListener("visibilitychange", onVisibility)
      mqlFine.removeEventListener("change", onMotionMediaChange)
      mqlReduce.removeEventListener("change", onMotionMediaChange)
      stopOrientation()
      removeGestureListeners()
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = 0
      }
    }
  }, [ensureRaf, resetToBaseline])

  return (
    <div
      ref={hostRef}
      className="hero-logo flex max-w-[calc(100vw-35px)] flex-1 items-center max-md:absolute max-md:top-1/2 max-md:left-1/2 max-md:w-full max-md:max-w-[calc(100vw-50px)] max-md:-translate-x-1/2 max-md:-translate-y-1/2"
    >
      <div
        ref={wrapperRef}
        className="relative"
        style={{
          // Explicit px width (not a % of the content-sized flex parent) so the
          // wrapper has an intrinsic size; maxWidth handles responsive shrink.
          width: `${HERO_VIEW_WIDTH}px`,
          maxWidth: "100%",
          aspectRatio: `${HERO_VIEW_WIDTH} / ${HERO_VIEW_HEIGHT}`,
        }}
      >
        <div
          className="absolute inset-0"
          dangerouslySetInnerHTML={{ __html: HERO_BASE_SVG }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={maskStyle}
        >
          <div
            ref={shadowLayerRef}
            className="absolute inset-0 will-change-transform"
            style={{ transform: `translate3d(0px, ${HERO_BASE_OFFSET}px, 0)` }}
            dangerouslySetInnerHTML={{ __html: HERO_SHADOW_LAYER_SVG }}
          />
          <div
            ref={highlightLayerRef}
            className="absolute inset-0 will-change-transform"
            style={{ transform: `translate3d(0px, ${-HERO_BASE_OFFSET}px, 0)` }}
            dangerouslySetInnerHTML={{ __html: HERO_HIGHLIGHT_LAYER_SVG }}
          />
        </div>
      </div>
    </div>
  )
}
