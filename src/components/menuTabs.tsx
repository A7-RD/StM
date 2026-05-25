"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import dynamic from "next/dynamic"
import { useLenis } from "lenis/react"
import gsap from "gsap"

import { Tabs, TabsContent } from "@/components/ui/tabs"
import MenuNav, { MenuImages, type MenuSectionMeta } from "./menuNav"
import MenuSection from "./menuSection"
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
  cocktails?: { name?: string; image?: unknown }
  warning?: string
}

type MenuTabsProps = {
  data?: MenusData
  dinnerItems: MenuItemRow[]
  wineMenuUrl?: string
  cocktailItems?: MenuItemRow[]
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
      id: "wine-list",
      title: data?.wine?.name ?? "Wine List",
      image: data?.wine?.image,
    },
  ]

  return (
    <>
      <div className="h-[125px]" ref={menuNavRef} />
      <div className="menu-container relative" ref={menuContainerRef}>
        <MenuImages sections={sections} activeId={activeId} />
        <Tabs value={activeId} onValueChange={handleSelect}>
          <MenuNav sections={sections} />
          <TabsContent value="dinner-menu" className="mt-0 outline-none">
            <MenuSection id="dinner-menu" items={dinnerItems} />
          </TabsContent>
          <TabsContent value="wine-list" className="mt-0 outline-none">
            <WineMenuInline pdfUrl={wineMenuUrl} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
