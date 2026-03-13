"use client";

import { useEffect, useState } from "react";

function isRestaurantOpenInDallas(hours) {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");

  const day = now.getDay();

  const timeInMinutes = hour * 60 + minute;
  const openAt = hours?.weekdays?.open * 60;
  const closeSunThu = hours?.weekdays?.close * 60;
  const closeFriSat = hours?.weekend?.close * 60;

  if (timeInMinutes < openAt) return false;

  if (day === 5 || day === 6) {
    return timeInMinutes < closeFriSat;
  }

  return timeInMinutes < closeSunThu;
}

export default function RestaurantHours({ hours }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function update() {
      setIsOpen(isRestaurantOpenInDallas(hours));
    }

    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [hours]);

  return (
    <div className="flex flex-col align-center gap-5">
      <div className="flex flex-col align-center m-flex-row m-gap-10 m-f14">
        <div>{hours?.weekdays?.text}</div>
        <div>{hours?.weekend?.text}</div>
      </div>
      <div className="capitalize op-4">
        {isOpen ? "Open Now" : "Closed Now"}
      </div>
    </div>
  );
}
