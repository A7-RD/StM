"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

export type HoursBlock = {
  weekdays?: { text?: string; open?: number; close?: number }
  weekend?: { text?: string; close?: number }
}

function hasDisplayableHours(hours: HoursBlock | null | undefined) {
  if (!hours) return false
  return Boolean(
    hours.weekdays?.text ||
      hours.weekend?.text ||
      (Number.isFinite(hours.weekdays?.open) &&
        Number.isFinite(hours.weekdays?.close)),
  )
}

function isRestaurantOpenInDallas(hours: HoursBlock | null | undefined) {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  })

  const parts = formatter.formatToParts(now)
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0")
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0")

  const day = now.getDay()

  const timeInMinutes = hour * 60 + minute
  const openAt = (hours?.weekdays?.open ?? 0) * 60
  const closeSunThu = (hours?.weekdays?.close ?? 0) * 60
  const closeFriSat = (hours?.weekend?.close ?? 0) * 60

  if (timeInMinutes < openAt) return false

  if (day === 5 || day === 6) {
    return timeInMinutes < closeFriSat
  }

  return timeInMinutes < closeSunThu
}

type RestaurantHoursProps = {
  hours?: HoursBlock | null
  className?: string
}

export default function RestaurantHours({
  hours,
  className,
}: RestaurantHoursProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    function update() {
      setIsOpen(isRestaurantOpenInDallas(hours))
    }

    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [hours])

  if (!hasDisplayableHours(hours)) {
    return null
  }

  return (
    <div
      className={cn("restaurant-hours items-center", className)}
    >
      <div className="restaurant-hours-lines flex-col gap-1 max-md:flex-row max-md:flex-wrap max-md:gap-2.5">
        <div>{hours?.weekdays?.text}</div>
        <div>{hours?.weekend?.text}</div>
      </div>
      <div className="restaurant-hours-status capitalize opacity-40">
        {isOpen ? "Open Now" : "Closed Now"}
      </div>
    </div>
  )
}
