import type { ReactNode } from "react"

import LenisProvider from "@/components/LenisProvider"
import SalInitializer from "@/components/salInitializer"
import "swiper/css"

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <LenisProvider>
      <SalInitializer />
      {children}
    </LenisProvider>
  )
}
