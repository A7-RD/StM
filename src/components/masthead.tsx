"use client"

import { useCallback, useState } from "react"

import ReservationButton from "./reservationButton"
import MobileToggle from "./mobileToggle"
import MobileMenu from "./mobileMenu"

type MastheadProps = {
  headerData?: Record<string, unknown>
  footerData?: Record<string, unknown>
}

export default function Masthead({ headerData, footerData }: MastheadProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const onToggle = useCallback(() => setMenuOpen((open) => !open), [])

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[100] box-border flex items-center justify-center bg-[linear-gradient(to_bottom,var(--color-paper)_15%,transparent_100%)] px-10 pt-6 pb-12 max-md:px-6">
        <ReservationButton data={headerData} />
        <MobileToggle isOpen={menuOpen} onToggle={onToggle} />
      </div>
      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        headerData={headerData}
        footerData={footerData}
      />
    </>
  )
}
