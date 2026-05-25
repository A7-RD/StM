"use client"

import { useCallback } from "react"
import Image from "next/image"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import RestaurantHours, { type HoursBlock } from "./restaurantHours"
import { cn } from "@/lib/utils"

const navLinkClass =
  "cursor-pointer border-0 bg-transparent p-0 font-inherit text-inherit"

type MobileMenuProps = {
  isOpen: boolean
  onClose: () => void
  headerData?: {
    reservation?: { link?: string; button?: string }
  }
  footerData?: {
    phone?: { link?: string; text?: string }
    address?: { street?: string; cityState?: string }
    hours?: HoursBlock
  }
}

export default function MobileMenu({
  isOpen,
  onClose,
  headerData,
  footerData,
}: MobileMenuProps) {
  const navigate = useCallback(
    (target: string) => {
      onClose()
      window.dispatchEvent(
        new CustomEvent("menu-navigate", { detail: { target } }),
      )
    },
    [onClose],
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        hideOverlay
        showCloseButton={false}
        className={cn(
          "fixed inset-0 left-0 top-0 z-[150] flex h-dvh max-h-none w-full max-w-none translate-x-0 translate-y-0 flex-col items-center justify-between gap-0 rounded-none border-0 bg-paper p-[35px] shadow-none ring-0 duration-300 data-closed:fade-out-0 data-open:fade-in-0 md:hidden",
        )}
      >
        <DialogTitle className="sr-only">Site menu</DialogTitle>
        <DialogClose
          render={
            <button
              type="button"
              className="mobile-menu-close-dot absolute top-[18px] right-4 z-[2] flex size-10 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0"
              aria-label="Close menu"
            />
          }
        />
        <div className="self-center">
          <Image
            src="/images/mobile-logo.svg"
            width={66}
            height={66}
            alt="St. Martins"
          />
        </div>
        <div className="flex flex-col items-center gap-10">
          <nav className="ds-text flex flex-col items-center gap-2.5 text-xl leading-[120%]">
            <button
              type="button"
              className={navLinkClass}
              onClick={() => navigate("dinner-menu")}
            >
              Dinner Menu
            </button>
            <button
              type="button"
              className={navLinkClass}
              onClick={() => navigate("wine-list")}
            >
              Wine List
            </button>
          </nav>
          <Button
            variant="reservation"
            nativeButton={false}
            render={
              <a
                href={headerData?.reservation?.link ?? "#"}
                className="text-center"
              />
            }
          >
            {headerData?.reservation?.button ?? "Make a Reservation"}
          </Button>
          <Button
            variant="reservation"
            nativeButton={false}
            className="-mt-5"
            render={<a href={footerData?.phone?.link ?? "#"} className="text-center" />}
          >
            {footerData?.phone?.text}
          </Button>
        </div>
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="ds-text-small flex gap-1.5 normal-case">
            <div>{footerData?.address?.street}</div>
            <div>{footerData?.address?.cityState}</div>
          </div>
          <RestaurantHours
            hours={footerData?.hours}
            className="items-center gap-2 [&_.restaurant-hours-lines]:flex-row [&_.restaurant-hours-lines]:justify-center"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
