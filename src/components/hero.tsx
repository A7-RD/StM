"use client"

import { useRef } from "react"

import HeroGraphic from "./heroGraphic"

function statementDisplayText(text: string | undefined) {
  if (!text) return text
  const letters = text.replace(/[^A-Za-zÀ-ÿ]/g, "")
  if (!letters.length || letters !== letters.toUpperCase()) return text
  return text
    .toLowerCase()
    .split(/(\s+)/)
    .map((segment) => {
      if (!segment.trim()) return segment
      return segment[0].toUpperCase() + segment.slice(1)
    })
    .join("")
}

type HeroData = { statement?: string }

export default function Hero({ data }: { data?: HeroData }) {
  const heroRef = useRef<HTMLDivElement | null>(null)

  return (
    <div
      ref={heroRef}
      className="relative flex h-dvh max-md:relative flex-col items-center justify-between"
    >
      <HeroGraphic heroRef={heroRef} />
      <div className="mx-auto flex w-[285px] max-w-full flex-col items-center gap-10 pb-[60px] text-center max-md:mt-auto">
        <p className="hero-statement">
          {statementDisplayText(data?.statement)}
        </p>
      </div>
    </div>
  )
}
