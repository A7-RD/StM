"use client";
import { useRef } from "react";
import HeroGraphic from "./heroGraphic";

export default function Hero({ data }) {
  const heroRef = useRef(null);

  return (
    <div
      ref={heroRef}
      className="hero h-100dvh flex flex-col space-between align-center"
    >
      <HeroGraphic heroRef={heroRef} />
      <div className="w-285px text-center flex flex-col align-center gap-40 m-mt-auto pb-60px">
        <p>{data?.statement}</p>
      </div>
    </div>
  );
}
