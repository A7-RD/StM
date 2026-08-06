"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useLenis } from "lenis/react"
import gsap from "gsap"

import { Tabs, TabsContent } from "@/components/ui/tabs"
import MenuNav, { MenuImages, type MenuSectionMeta } from "./menuNav"
import MenuSection from "./menuSection"
import HappyHourSection from "./happyHourSection"
import { initSal } from "@/utils/sal"

const WineMenuInline = dynamic(() => import("./wineMenuInline"), {
  ssr: false,
})

type MenuItemRow = {
  name?: string
  price?: string
  description?: string
  section?: string
}

type MenusData = {
  dinner?: { name?: string; image?: unknown }
  wine?: { name?: string; image?: unknown }
  happyHour?: { name?: string; image?: unknown }
  warning?: string
}

type MenuTabsProps = {
  data?: MenusData
  dinnerItems: MenuItemRow[]
  wineMenuUrl?: string
}

export default function MenuTabs({
  data,
  dinnerItems,
  wineMenuUrl,
}: MenuTabsProps) {
  const [activeId, setActiveId] = useState("dinner-menu")
  const menuNavRef = useRef<HTMLDivElement | null>(null)
  const menuContainerRef = useRef<HTMLDivElement | null>(null)
  const lenis = useLenis()

  useEffect(() => {
    initSal()
  }, [activeId])

  useEffect(() => {
    const el = menuContainerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle("menu-active", entry.isIntersecting)
      },
      { threshold: 0 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      document.body.classList.remove("menu-active")
    }
  }, [])

  const handleSelect = useCallback(
    (id: string | number) => {
      const next = String(id)
      setActiveId(next)
      if (lenis && menuNavRef.current) {
        lenis.scrollTo(menuNavRef.current, {
          duration: 1.2,
          easing: gsap.parseEase("power3.inOut"),
        })
      }
    },
    [lenis],
  )

  useEffect(() => {
    const onMenuNavigate = (e: Event) => {
      const ce = e as CustomEvent<{ target?: string }>
      if (ce.detail?.target) handleSelect(ce.detail.target)
    }
    window.addEventListener("menu-navigate", onMenuNavigate)
    return () => window.removeEventListener("menu-navigate", onMenuNavigate)
  }, [handleSelect])

  const sections: MenuSectionMeta[] = [
    {
      id: "dinner-menu",
      title: data?.dinner?.name ?? "Dinner Menu",
      image: data?.dinner?.image,
    },
    {
      id: "happy-hour",
      title: data?.happyHour?.name ?? "Happy Hour",
      staticSrc: "/images/StM_HH.svg",
      imageContainerClassName:
        "aspect-[321.54/210.46] w-[400px] max-md:w-[min(100%,300px)]",
    },
    {
      id: "wine-list",
      title: data?.wine?.name ?? "Wine List",
      image: data?.wine?.image,
    },
    {
      id: "restaurant-week",
      title: "Restaurant Week",
    },
  ]

  return (
    <div className="mt-32">
      <div className="h-32" ref={menuNavRef} />
      <div className="menu-container relative" ref={menuContainerRef}>
        <MenuImages sections={sections} activeId={activeId} />
        <Tabs value={activeId} onValueChange={handleSelect}>
          <MenuNav sections={sections} />
          <TabsContent
            id="menu-panel-dinner-menu"
            value="dinner-menu"
            className="mt-0 outline-none"
          >
            <MenuSection id="dinner-menu" items={dinnerItems} />
          </TabsContent>
          <TabsContent
            id="menu-panel-happy-hour"
            value="happy-hour"
            className="mt-0 outline-none"
          >
            <HappyHourSection isActive={activeId === "happy-hour"} />
          </TabsContent>
          <TabsContent
            id="menu-panel-wine-list"
            value="wine-list"
            className="mt-0 outline-none"
          >
            <WineMenuInline pdfUrl={wineMenuUrl} />
          </TabsContent>
          <TabsContent
            id="menu-panel-restaurant-week"
            value="restaurant-week"
            className="mt-0 outline-none"
          >
            <section
              id="restaurant-week"
              className="flex justify-center px-8 pt-[60px] max-md:pt-10"
            >
              <Image
                src="/images/Restaurant Week 2026 — Prix Fixe Menu@2x (1).webp"
                alt="Restaurant Week 2026 menu"
                width={1056}
                height={1632}
                className="h-auto w-full max-w-[520px]"
                unoptimized
                priority
              />
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
