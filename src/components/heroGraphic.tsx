"use client"

import {
  useCallback,
  useEffect,
  useRef,
  type RefObject,
} from "react"

import { HERO_SVG_MARKUP } from "./heroSvgMarkup"

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

type HeroGraphicProps = {
  heroRef?: RefObject<HTMLDivElement | null>
}

export default function HeroGraphic({ heroRef }: HeroGraphicProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const shadowOffsetRef = useRef<SVGFEOffsetElement | null>(null)
  const highlightOffsetRef = useRef<SVGFEOffsetElement | null>(null)
  const baseShadowRef = useRef({ dx: 0, dy: 0 })
  const baseHighlightRef = useRef({ dx: 0, dy: 0 })
  const rectRef = useRef<DOMRect | null>(null)
  const targetRef = useRef({ dx: 0, dy: 0 })
  const currentRef = useRef({ dx: 0, dy: 0 })
  const rafRef = useRef(0)
  const motionEnabledRef = useRef(false)

  useEffect(() => {
    const svg = hostRef.current?.querySelector("svg")
    if (!svg) return

    const shadowEl = svg.querySelector(
      'feOffset[data-role="shadow"]',
    ) as SVGFEOffsetElement | null
    const highlightEl = svg.querySelector(
      'feOffset[data-role="highlight"]',
    ) as SVGFEOffsetElement | null
    shadowOffsetRef.current = shadowEl
    highlightOffsetRef.current = highlightEl

    function readBase(el: SVGFEOffsetElement | null) {
      return {
        dx: Number.parseFloat(el?.getAttribute("dx") ?? "0") || 0,
        dy: Number.parseFloat(el?.getAttribute("dy") ?? "0") || 0,
      }
    }
    baseShadowRef.current = readBase(shadowEl)
    baseHighlightRef.current = readBase(highlightEl)
  }, [])

  useEffect(() => {
    const el = heroRef?.current ?? hostRef.current
    if (!el) return

    function updateRect() {
      const node = heroRef?.current ?? hostRef.current
      if (!node) return
      rectRef.current = node.getBoundingClientRect()
    }

    updateRect()
    window.addEventListener("resize", updateRect, { passive: true })
    window.addEventListener("scroll", updateRect, { passive: true })
    return () => {
      window.removeEventListener("resize", updateRect)
      window.removeEventListener("scroll", updateRect)
    }
  }, [heroRef])

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

      const shadow = shadowOffsetRef.current
      if (shadow) {
        const baseShadow = baseShadowRef.current
        shadow.setAttribute("dx", (baseShadow.dx + current.dx).toFixed(2))
        shadow.setAttribute("dy", (baseShadow.dy + current.dy).toFixed(2))
      }
      const highlight = highlightOffsetRef.current
      if (highlight) {
        const baseHighlight = baseHighlightRef.current
        const hdx = current.dx * HIGHLIGHT_GAIN
        const hdy = current.dy * HIGHLIGHT_GAIN
        highlight.setAttribute("dx", (baseHighlight.dx - hdx).toFixed(2))
        highlight.setAttribute("dy", (baseHighlight.dy - hdy).toFixed(2))
      }

      if (!settled) {
        rafRef.current = requestAnimationFrame(step)
      }
    }

    rafRef.current = requestAnimationFrame(step)
  }, [])

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
      dangerouslySetInnerHTML={{ __html: HERO_SVG_MARKUP }}
    />
  )
}
