"use client";

import { useCallback, useEffect, useRef } from "react";

import { HERO_SVG_MARKUP } from "./heroSvgMarkup";

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Base hero filters use ~+2px shadow dy. Linear ny (−1 top … +1 bottom) made the
 * top over-strong (large +dy) and the bottom nearly flat (large −dy cancels base).
 */
const NY_TOP_GAIN = 0.1;
const NY_BOTTOM_GAIN = 1.95;
const MAX_DY_POSITIVE = 1.95;
const MAX_DY_NEGATIVE = 3.85;

/** Max extra px added to each SVG feOffset; lower = subtler at hero edges */
const MAX_OFFSET = 2.5;
/** Highlight moves opposite to the shadow; below 1 = subtler rim */
const HIGHLIGHT_GAIN = 0.9;
/** Degrees of tilt from baseline for full MAX_OFFSET (device orientation) */
const ORIENTATION_SENS_DEG = 22;
/** Per-frame interpolation factor; higher = snappier, lower = smoother */
const LERP_FACTOR = 0.18;
/** Stop the rAF loop once we're this close to the target on both axes */
const SETTLE_EPSILON = 0.01;

function lightingDeltas(nx, ny) {
  const radial = Math.hypot(nx, ny);
  const cornerScale = radial < 1e-6 ? 1 : Math.min(1, 1 / radial);
  const nyWeighted = ny <= 0 ? ny * NY_TOP_GAIN : ny * NY_BOTTOM_GAIN;
  return {
    dx: clamp(-nx * MAX_OFFSET * cornerScale, -MAX_OFFSET, MAX_OFFSET),
    dy: clamp(
      -nyWeighted * MAX_OFFSET * cornerScale,
      -MAX_DY_NEGATIVE,
      MAX_DY_POSITIVE,
    ),
  };
}

export default function HeroGraphic({ heroRef }) {
  const hostRef = useRef(null);
  const shadowOffsetRef = useRef(null);
  const highlightOffsetRef = useRef(null);
  const baseShadowRef = useRef({ dx: 0, dy: 0 });
  const baseHighlightRef = useRef({ dx: 0, dy: 0 });
  const rectRef = useRef(null);
  const targetRef = useRef({ dx: 0, dy: 0 });
  const currentRef = useRef({ dx: 0, dy: 0 });
  const rafRef = useRef(0);
  const motionEnabledRef = useRef(false);

  // Cache feOffset element refs and their baseline dx/dy once the SVG is mounted.
  useEffect(() => {
    const svg = hostRef.current?.querySelector("svg");
    if (!svg) return;

    const shadowEl = svg.querySelector('feOffset[data-role="shadow"]');
    const highlightEl = svg.querySelector('feOffset[data-role="highlight"]');
    shadowOffsetRef.current = shadowEl;
    highlightOffsetRef.current = highlightEl;

    function readBase(el) {
      return {
        dx: Number.parseFloat(el?.getAttribute("dx") ?? "0") || 0,
        dy: Number.parseFloat(el?.getAttribute("dy") ?? "0") || 0,
      };
    }
    baseShadowRef.current = readBase(shadowEl);
    baseHighlightRef.current = readBase(highlightEl);
  }, []);

  // Pull the hero rect into a ref. Refresh only on layout-affecting events so the
  // pointermove handler never has to touch layout.
  useEffect(() => {
    const root = heroRef?.current ?? hostRef.current;
    if (!root) return;

    function updateRect() {
      rectRef.current = root.getBoundingClientRect();
    }

    updateRect();
    window.addEventListener("resize", updateRect, { passive: true });
    window.addEventListener("scroll", updateRect, { passive: true });
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
    };
  }, [heroRef]);

  // rAF loop: lerp current → target, write to the two cached feOffset elements.
  // Auto-stops when settled so there's no idle CPU cost.
  const ensureRaf = useCallback(() => {
    if (rafRef.current) return;

    function step() {
      rafRef.current = 0;
      const target = targetRef.current;
      const current = currentRef.current;

      const nextDx = current.dx + (target.dx - current.dx) * LERP_FACTOR;
      const nextDy = current.dy + (target.dy - current.dy) * LERP_FACTOR;
      const settled =
        Math.abs(nextDx - target.dx) < SETTLE_EPSILON &&
        Math.abs(nextDy - target.dy) < SETTLE_EPSILON;

      current.dx = settled ? target.dx : nextDx;
      current.dy = settled ? target.dy : nextDy;

      const shadow = shadowOffsetRef.current;
      if (shadow) {
        const baseShadow = baseShadowRef.current;
        shadow.setAttribute("dx", (baseShadow.dx + current.dx).toFixed(2));
        shadow.setAttribute("dy", (baseShadow.dy + current.dy).toFixed(2));
      }
      const highlight = highlightOffsetRef.current;
      if (highlight) {
        const baseHighlight = baseHighlightRef.current;
        const hdx = current.dx * HIGHLIGHT_GAIN;
        const hdy = current.dy * HIGHLIGHT_GAIN;
        highlight.setAttribute("dx", (baseHighlight.dx - hdx).toFixed(2));
        highlight.setAttribute("dy", (baseHighlight.dy - hdy).toFixed(2));
      }

      if (!settled) {
        rafRef.current = requestAnimationFrame(step);
      }
    }

    rafRef.current = requestAnimationFrame(step);
  }, []);

  const resetToBaseline = useCallback(() => {
    targetRef.current = { dx: 0, dy: 0 };
    ensureRaf();
  }, [ensureRaf]);

  // Pointer, visibility, reduced-motion / fine-pointer, and device orientation.
  useEffect(() => {
    const mqlFine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mqlReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let baselineGamma = null;
    let baselineBeta = null;
    let orientationListening = false;
    let gestureListenersActive = false;

    function syncMotionEnabled() {
      motionEnabledRef.current = mqlFine.matches && !mqlReduce.matches;
      if (!motionEnabledRef.current) resetToBaseline();
    }

    function onDeviceOrientation(e) {
      if (mqlFine.matches || mqlReduce.matches) return;
      if (e.gamma == null || e.beta == null) return;
      if (baselineGamma === null) {
        baselineGamma = e.gamma;
        baselineBeta = e.beta;
      }
      const nx = clamp(
        (e.gamma - baselineGamma) / ORIENTATION_SENS_DEG,
        -1,
        1,
      );
      const ny = clamp(
        (e.beta - baselineBeta) / ORIENTATION_SENS_DEG,
        -1,
        1,
      );
      targetRef.current = lightingDeltas(nx, ny);
      ensureRaf();
    }

    function startOrientation() {
      if (orientationListening) return;
      window.addEventListener("deviceorientation", onDeviceOrientation);
      orientationListening = true;
    }

    function stopOrientation() {
      if (!orientationListening) return;
      window.removeEventListener("deviceorientation", onDeviceOrientation);
      orientationListening = false;
      baselineGamma = null;
      baselineBeta = null;
    }

    function iosOrientationNeedsPermission() {
      return (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      );
    }

    function removeGestureListeners() {
      if (!gestureListenersActive) return;
      window.removeEventListener("touchstart", onUserGesture);
      window.removeEventListener("click", onUserGesture);
      gestureListenersActive = false;
    }

    function onUserGesture() {
      removeGestureListeners();

      if (iosOrientationNeedsPermission()) {
        DeviceOrientationEvent.requestPermission()
          .then((permission) => {
            if (permission === "granted") startOrientation();
          })
          .catch(() => {});
      } else {
        startOrientation();
      }
    }

    function addGestureListeners() {
      if (gestureListenersActive) return;
      window.addEventListener("touchstart", onUserGesture, { passive: true });
      window.addEventListener("click", onUserGesture);
      gestureListenersActive = true;
    }

    function syncOrientation() {
      stopOrientation();
      removeGestureListeners();

      if (mqlReduce.matches || mqlFine.matches) {
        resetToBaseline();
        return;
      }

      if (iosOrientationNeedsPermission()) {
        addGestureListeners();
      } else {
        startOrientation();
      }
    }

    function onMotionMediaChange() {
      syncMotionEnabled();
      syncOrientation();
    }

    function onPointerMove(e) {
      if (!motionEnabledRef.current) return;
      const rect = rectRef.current;
      if (!rect || !rect.width || !rect.height) return;

      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!inside) {
        resetToBaseline();
        return;
      }

      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetRef.current = lightingDeltas(nx, ny);
      ensureRaf();
    }

    function onVisibility() {
      if (document.visibilityState !== "visible") resetToBaseline();
    }

    syncMotionEnabled();
    syncOrientation();

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", resetToBaseline);
    document.addEventListener("visibilitychange", onVisibility);
    mqlFine.addEventListener("change", onMotionMediaChange);
    mqlReduce.addEventListener("change", onMotionMediaChange);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", resetToBaseline);
      document.removeEventListener("visibilitychange", onVisibility);
      mqlFine.removeEventListener("change", onMotionMediaChange);
      mqlReduce.removeEventListener("change", onMotionMediaChange);
      stopOrientation();
      removeGestureListeners();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
  }, [ensureRaf, resetToBaseline]);

  return (
    <div
      ref={hostRef}
      className="flex-1 flex align-center hero-logo"
      dangerouslySetInnerHTML={{ __html: HERO_SVG_MARKUP }}
    />
  );
}
