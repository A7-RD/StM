"use client"

import type { ReactNode } from "react"
import { ReactLenis } from "lenis/react"

const SCROLL_OPTIONS = {
  duration: 1.2,
  orientation: "vertical" as const,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1,
  smoothTouch: false,
}

export default function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={SCROLL_OPTIONS}>
      {children}
    </ReactLenis>
  )
}
