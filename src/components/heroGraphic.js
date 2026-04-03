"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

function lightingDeltas(nx, ny, maxOffset) {
  const radial = Math.hypot(nx, ny);
  const cornerScale =
    radial < 1e-6 ? 1 : Math.min(1, 1 / radial);
  const nyWeighted = ny <= 0 ? ny * NY_TOP_GAIN : ny * NY_BOTTOM_GAIN;
  return {
    dx: clamp(
      -nx * maxOffset * cornerScale,
      -maxOffset,
      maxOffset,
    ),
    dy: clamp(
      -nyWeighted * maxOffset * cornerScale,
      -MAX_DY_NEGATIVE,
      MAX_DY_POSITIVE,
    ),
  };
}

function useMediaQuery(query) {
  const matchesRef = useRef(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => {
      matchesRef.current = mql.matches;
    };

    update();
    if (mql.addEventListener) {
      mql.addEventListener("change", update);
      return () => mql.removeEventListener("change", update);
    }

    mql.addListener(update);
    return () => mql.removeListener(update);
  }, [query]);

  return matchesRef;
}

export default function HeroGraphic({ heroRef }) {
  const svgHostRef = useRef(null);
  const [svg, setSvg] = useState("");
  const origShadowRef = useRef([]);
  const origHighlightRef = useRef([]);
  const dualLightingOkRef = useRef(false);
  const rafRef = useRef(0);
  const targetRef = useRef({ dx: 0, dy: 0 });

  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );
  const isFinePointer = useMediaQuery("(hover: hover) and (pointer: fine)");

  /** Max extra px added to each SVG feOffset; lower = subtler at hero edges */
  const maxOffset = 2.5;
  /** Degrees of tilt from baseline for full maxOffset (device orientation) */
  const orientationSensDeg = 22;
  /** Scales pointer delta for highlight (opposite direction); below 1 = subtler rim */
  const highlightGain = 0.9;
  const filterPadding =
    Math.max(maxOffset, MAX_DY_POSITIVE, MAX_DY_NEGATIVE) + 4;

  const applyFeOffsetOrigins = useCallback(() => {
    const svgEl = svgHostRef.current?.querySelector("svg");
    if (!svgEl) return;

    const shadows = svgEl.querySelectorAll('feOffset[data-role="shadow"]');
    const highlights = svgEl.querySelectorAll('feOffset[data-role="highlight"]');

    if (shadows.length) {
      Array.from(shadows).forEach((el, i) => {
        el.setAttribute("dx", String(origShadowRef.current[i]?.dx0 ?? 0));
        el.setAttribute("dy", String(origShadowRef.current[i]?.dy0 ?? 0));
      });
      if (dualLightingOkRef.current) {
        Array.from(highlights).forEach((el, i) => {
          el.setAttribute("dx", String(origHighlightRef.current[i]?.dx0 ?? 0));
          el.setAttribute("dy", String(origHighlightRef.current[i]?.dy0 ?? 0));
        });
      }
    } else {
      Array.from(svgEl.querySelectorAll("feOffset")).forEach((el, i) => {
        el.setAttribute("dx", String(origShadowRef.current[i]?.dx0 ?? 0));
        el.setAttribute("dy", String(origShadowRef.current[i]?.dy0 ?? 0));
      });
    }
  }, []);

  const resetShadow = useCallback(() => {
    targetRef.current = { dx: 0, dy: 0 };
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        applyFeOffsetOrigins();
      });
    }
  }, [applyFeOffsetOrigins]);

  useEffect(() => {
    fetch("/images/hero.svg")
      .then((r) => r.text())
      .then(setSvg);
  }, []);

  useEffect(() => {
    const host = svgHostRef.current ?? heroRef?.current;
    const svgEl = host?.querySelector?.("svg");
    if (!svgEl) return;

    for (const filterEl of svgEl.querySelectorAll("filter")) {
      if (filterEl.getAttribute("filterUnits") !== "userSpaceOnUse") continue;

      const x = Number.parseFloat(filterEl.getAttribute("x") ?? "");
      const y = Number.parseFloat(filterEl.getAttribute("y") ?? "");
      const w = Number.parseFloat(filterEl.getAttribute("width") ?? "");
      const h = Number.parseFloat(filterEl.getAttribute("height") ?? "");
      if (![x, y, w, h].every(Number.isFinite)) continue;

      filterEl.setAttribute("x", String(x - filterPadding));
      filterEl.setAttribute("y", String(y - filterPadding));
      filterEl.setAttribute("width", String(w + filterPadding * 2));
      filterEl.setAttribute("height", String(h + filterPadding * 2));
    }

    let shadowEls = svgEl.querySelectorAll('feOffset[data-role="shadow"]');
    const highlightEls = svgEl.querySelectorAll(
      'feOffset[data-role="highlight"]',
    );

    if (!shadowEls.length) {
      shadowEls = svgEl.querySelectorAll("feOffset");
      dualLightingOkRef.current = false;
      origHighlightRef.current = [];
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "heroGraphic: no feOffset[data-role=shadow]; using legacy single-offset mode",
        );
      }
    } else {
      dualLightingOkRef.current =
        shadowEls.length === highlightEls.length && shadowEls.length > 0;
      if (!dualLightingOkRef.current && process.env.NODE_ENV === "development") {
        console.warn(
          "heroGraphic: shadow/highlight feOffset count mismatch; highlight stays static",
        );
      }
      origHighlightRef.current = Array.from(highlightEls).map((el) => ({
        dx0: Number.parseFloat(el.getAttribute("dx") ?? "0") || 0,
        dy0: Number.parseFloat(el.getAttribute("dy") ?? "0") || 0,
      }));
    }

    origShadowRef.current = Array.from(shadowEls).map((el) => ({
      dx0: Number.parseFloat(el.getAttribute("dx") ?? "0") || 0,
      dy0: Number.parseFloat(el.getAttribute("dy") ?? "0") || 0,
    }));

    resetShadow();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [filterPadding, heroRef, resetShadow, svg]);

  const scheduleApply = useCallback(() => {
    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;

      const { dx, dy } = targetRef.current;
      const hdx = dx * highlightGain;
      const hdy = dy * highlightGain;
      const svgEl = svgHostRef.current?.querySelector("svg");
      if (!svgEl) return;

      const shadows = svgEl.querySelectorAll('feOffset[data-role="shadow"]');
      const highlights = svgEl.querySelectorAll(
        'feOffset[data-role="highlight"]',
      );

      Array.from(shadows).forEach((el, i) => {
        el.setAttribute(
          "dx",
          ((origShadowRef.current[i]?.dx0 ?? 0) + dx).toFixed(2),
        );
        el.setAttribute(
          "dy",
          ((origShadowRef.current[i]?.dy0 ?? 0) + dy).toFixed(2),
        );
      });

      if (dualLightingOkRef.current) {
        Array.from(highlights).forEach((el, i) => {
          el.setAttribute(
            "dx",
            ((origHighlightRef.current[i]?.dx0 ?? 0) - hdx).toFixed(2),
          );
          el.setAttribute(
            "dy",
            ((origHighlightRef.current[i]?.dy0 ?? 0) - hdy).toFixed(2),
          );
        });
      } else if (!shadows.length) {
        Array.from(svgEl.querySelectorAll("feOffset")).forEach((el, i) => {
          el.setAttribute(
            "dx",
            ((origShadowRef.current[i]?.dx0 ?? 0) + dx).toFixed(2),
          );
          el.setAttribute(
            "dy",
            ((origShadowRef.current[i]?.dy0 ?? 0) + dy).toFixed(2),
          );
        });
      }
    });
  }, [highlightGain]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = 0;
        }
        resetShadow();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [resetShadow]);

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (prefersReducedMotion.current || !isFinePointer.current) return;

      const root = heroRef?.current ?? svgHostRef.current;
      if (!root) return;

      const rect = root.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const insideX = e.clientX >= rect.left && e.clientX <= rect.right;
      const insideY = e.clientY >= rect.top && e.clientY <= rect.bottom;

      if (!insideX || !insideY) {
        resetShadow();
        return;
      }

      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      targetRef.current = lightingDeltas(nx, ny, maxOffset);

      scheduleApply();
    };

    const handlePointerLeave = () => {
      resetShadow();
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", handlePointerLeave);
      resetShadow();
    };
  }, [
    heroRef,
    isFinePointer,
    prefersReducedMotion,
    resetShadow,
    scheduleApply,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mqlFine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mqlReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let mounted = true;
    let baselineGamma = null;
    let baselineBeta = null;
    let orientationAttached = false;
    let tapAttached = false;

    const applyFromTilt = (gamma, beta) => {
      if (
        gamma == null ||
        beta == null ||
        Number.isNaN(gamma) ||
        Number.isNaN(beta)
      ) {
        return;
      }
      if (baselineGamma === null) {
        baselineGamma = gamma;
        baselineBeta = beta;
      }
      const dg = gamma - baselineGamma;
      const db = beta - baselineBeta;
      const nx = clamp(dg / orientationSensDeg, -1, 1);
      const ny = clamp(db / orientationSensDeg, -1, 1);

      targetRef.current = lightingDeltas(nx, ny, maxOffset);
      scheduleApply();
    };

    const onDeviceOrientation = (e) => {
      if (!mounted || mqlFine.matches || mqlReduce.matches) return;
      applyFromTilt(e.gamma, e.beta);
    };

    const attachOrientation = () => {
      if (orientationAttached) return;
      window.addEventListener("deviceorientation", onDeviceOrientation);
      orientationAttached = true;
    };

    const detachOrientation = () => {
      if (!orientationAttached) return;
      window.removeEventListener("deviceorientation", onDeviceOrientation);
      orientationAttached = false;
      baselineGamma = null;
      baselineBeta = null;
    };

    const onUserGesture = () => {
      if (!mounted || mqlFine.matches || mqlReduce.matches) return;

      const needIosPermission =
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function";

      const permissionPromise = needIosPermission
        ? DeviceOrientationEvent.requestPermission()
        : null;

      window.removeEventListener("touchstart", onUserGesture);
      window.removeEventListener("click", onUserGesture);
      tapAttached = false;

      if (permissionPromise) {
        permissionPromise
          .then((permission) => {
            if (permission === "granted" && mounted) attachOrientation();
          })
          .catch(() => {});
      } else {
        attachOrientation();
      }
    };

    const attachTapIfNeeded = () => {
      if (tapAttached) return;
      window.addEventListener("touchstart", onUserGesture, { passive: true });
      window.addEventListener("click", onUserGesture);
      tapAttached = true;
    };

    const sync = () => {
      detachOrientation();
      if (tapAttached) {
        window.removeEventListener("touchstart", onUserGesture);
        window.removeEventListener("click", onUserGesture);
        tapAttached = false;
      }
      if (!mounted) return;

      if (mqlReduce.matches || mqlFine.matches) {
        resetShadow();
        return;
      }

      const needIosPermission =
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function";

      if (needIosPermission) {
        attachTapIfNeeded();
      } else {
        attachOrientation();
      }
    };

    sync();
    const onMq = () => sync();
    mqlFine.addEventListener("change", onMq);
    mqlReduce.addEventListener("change", onMq);

    return () => {
      mounted = false;
      mqlFine.removeEventListener("change", onMq);
      mqlReduce.removeEventListener("change", onMq);
      detachOrientation();
      if (tapAttached) {
        window.removeEventListener("touchstart", onUserGesture);
        window.removeEventListener("click", onUserGesture);
      }
      resetShadow();
    };
  }, [maxOffset, orientationSensDeg, resetShadow, scheduleApply]);

  return (
    <div
      ref={svgHostRef}
      className="flex-1 flex align-center hero-logo"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
