"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import MenuNav from "./menuNav";
import MenuSection from "./menuSection";
import dynamic from "next/dynamic";
const WineMenuInline = dynamic(() => import("./wineMenuInline"), {
  ssr: false,
});
import { initSal } from "@/utils/sal";

export default function MenuTabs({ data, dinnerItems, wineMenuUrl, cocktailItems }) {
  const [activeId, setActiveId] = useState("dinner-menu");
  const menuNavRef = useRef(null);
  const menuContainerRef = useRef(null);
  const lenis = useLenis();

  useEffect(() => {
    initSal()
  }, [activeId]);

  /* Hide fixed reservation CTA while any part of the menu block is in view; show again above or below it */
  useEffect(() => {
    const el = menuContainerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle("menu-active", entry.isIntersecting);
      },
      { threshold: 0 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      document.body.classList.remove("menu-active");
    };
  }, []);

  const handleSelect = useCallback((id) => {
    setActiveId(id);
    if (lenis && menuNavRef.current) {
      lenis.scrollTo(menuNavRef.current, {
        duration: 1.2,
        easing: gsap.parseEase("power3.inOut"),
      });
    }
  }, [lenis]);

  useEffect(() => {
    const onMenuNavigate = (e) => handleSelect(e.detail.target);
    window.addEventListener('menu-navigate', onMenuNavigate);
    return () => window.removeEventListener('menu-navigate', onMenuNavigate);
  }, [handleSelect]);

  const sections = [
    { id: "dinner-menu", title: data?.dinner?.name ?? "Dinner Menu", items: dinnerItems, image: data?.dinner?.image },
    { id: "wine-list", title: data?.wine?.name ?? "Wine List", items: null, image: data?.wine?.image },
    // { id: "cocktails-spirits", title: data?.cocktails?.name ?? "Cocktails & Spirits", items: cocktailItems, image: data?.cocktails?.image },
  ];

  const active = sections.find((s) => s.id === activeId);

  return (
    <>
      <div className="h-125px" ref={menuNavRef} />
      <div className="menu-container" ref={menuContainerRef}>
        <MenuNav sections={sections} activeId={activeId} onSelect={handleSelect} />
        {active && active.id !== "wine-list" && <MenuSection id={active.id} items={active.items} />}
        {activeId === "wine-list" && <WineMenuInline pdfUrl={wineMenuUrl} />}
      </div>
    </>
  );
}
