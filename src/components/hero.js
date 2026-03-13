"use client";
import { useRef } from "react";
import HeroGraphic from "./heroGraphic";
import ReservationButton from "./reservationButton";

export default function Hero({ data, headerData }) {
  const heroRef = useRef(null);

  return (
    <div
      ref={heroRef}
      className="hero h-100dvh flex flex-col space-between align-center"
    >
      <ReservationButton data={headerData} />
      <HeroGraphic heroRef={heroRef} />
      <div className="w-285px text-center flex flex-col align-center gap-40 m-mt-auto pb-60px">
        <p className="m-show">Make a Reservation</p>
        <p>{data?.statement}</p>
      </div>
    </div>
  );
}
