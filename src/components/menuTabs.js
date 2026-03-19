"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import MenuNav from "./menuNav";
import MenuSection from "./menuSection";
import dynamic from "next/dynamic";
const WineMenuLightbox = dynamic(() => import("./wineMenuLightbox"), {
  ssr: false,
});
import Spacer from "./spacer";
import { initSal } from "@/utils/sal";

export default function MenuTabs({ data, dinnerItems, wineMenuUrl, cocktailItems }) {
  const [activeId, setActiveId] = useState("dinner-menu");
  const [wineLightboxOpen, setWineLightboxOpen] = useState(false);
  const menuNavRef = useRef(null);
  const lenis = useLenis();

  useEffect(() => {
    initSal()
  }, [activeId]);

  useEffect(() => {
    const el = menuNavRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isAbove = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        document.body.classList.toggle("menu-active", isAbove);
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      document.body.classList.remove("menu-active");
    };
  }, []);

  const handleSelect = useCallback((id) => {
    setActiveId(id);
    if (id === "wine-list") {
      setWineLightboxOpen(true);
    }
    if (lenis && menuNavRef.current) {
      lenis.scrollTo(menuNavRef.current, {
        duration: 1.2,
        easing: gsap.parseEase("power3.inOut"),
      });
    }
  }, [lenis]);

  const sections = [
    { id: "dinner-menu", title: data?.dinner?.name ?? "Dinner Menu", items: dinnerItems, image: data?.dinner?.image },
    { id: "wine-list", title: data?.wine?.name ?? "Wine List", items: null, image: data?.wine?.image },
    { id: "cocktails-spirits", title: data?.cocktails?.name ?? "Cocktails & Spirits", items: cocktailItems, image: data?.cocktails?.image },
  ];

  const active = sections.find((s) => s.id === activeId);

  return (
    <>
      <div className="h-125px" ref={menuNavRef} />
      <MenuNav sections={sections} activeId={activeId} onSelect={handleSelect} />
      {active && active.id !== "wine-list" && <MenuSection id={active.id} items={active.items} />}
      <WineMenuLightbox pdfUrl={wineMenuUrl} isOpen={wineLightboxOpen} onClose={() => setWineLightboxOpen(false)} />
    </>
  );
}
