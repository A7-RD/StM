import type { ReactNode } from "react"

import { SanityLive } from "@/sanity/lib/live"

import "./globals.css"

export const metadata = {
  title: "St. Martins",
  description: "",
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SanityLive />
      </body>
    </html>
  )
}
