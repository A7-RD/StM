import type { ReactNode } from "react"

import { SanityLive } from "@/sanity/lib/live"

import "./globals.css"

export const metadata = {
  title: "St. Martins",
  description: "",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
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
