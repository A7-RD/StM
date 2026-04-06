"use client";
import { useRef } from "react";
import HeroGraphic from "./heroGraphic";

/** If the whole phrase is stored in caps, show title-style casing; otherwise trust CMS. */
function statementDisplayText(text) {
  if (!text) return text;
  const letters = text.replace(/[^A-Za-zÀ-ÿ]/g, "");
  if (!letters.length || letters !== letters.toUpperCase()) return text;
  return text
    .toLowerCase()
    .split(/(\s+)/)
    .map((segment) => {
      if (!segment.trim()) return segment;
      return segment[0].toUpperCase() + segment.slice(1);
    })
    .join("");
}

export default function Hero({ data }) {
  const heroRef = useRef(null);

  return (
    <div
      ref={heroRef}
      className="hero h-100dvh flex flex-col space-between align-center"
    >
      <HeroGraphic heroRef={heroRef} />
      <div className="w-285px text-center flex flex-col align-center gap-40 m-mt-auto pb-60px">
        <p className="hero__statement">
          {statementDisplayText(data?.statement)}
        </p>
      </div>
    </div>
  );
}
