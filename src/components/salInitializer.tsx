"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

import { initSal } from "@/utils/sal"

export default function SalInitializer() {
  const pathname = usePathname()
  useEffect(() => {
    initSal()
  }, [pathname])
  return null
}
