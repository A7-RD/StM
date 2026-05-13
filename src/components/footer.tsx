import Image from "next/image"

import { urlFor } from "@/sanity/lib/image"
import RestaurantHours, { type HoursBlock } from "./restaurantHours"

type Address = {
  street?: string
  cityState?: string
  text?: string
  link?: string
}

type FooterData = {
  phone?: { link?: string; text?: string }
  address?: Address
  hours?: HoursBlock
  handle?: { link?: string; text?: string }
  tagline?: string
  image?: unknown
}

function FooterAddress({ address }: { address?: Address }) {
  const hasLines = Boolean(address?.street || address?.cityState)
  const href = address?.link ?? ""

  if (hasLines) {
    const inner = (
      <>
        {address?.street ? <span>{address.street}</span> : null}
        {address?.cityState ? <span>{address.cityState}</span> : null}
      </>
    )
    if (href) {
      return (
        <a
          className="flex flex-col items-start gap-1 text-sm leading-5 tracking-[-0.01em] no-underline text-inherit"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {inner}
        </a>
      )
    }
    return (
      <div className="flex flex-col items-start gap-1 text-sm leading-5 tracking-[-0.01em]">
        {inner}
      </div>
    )
  }

  if (address?.text) {
    return (
      <a
        className="flex flex-col items-start gap-1 text-sm leading-5 tracking-[-0.01em] no-underline text-inherit"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {address.text}
      </a>
    )
  }

  return null
}

export default function Footer({ data }: { data?: FooterData }) {
  return (
    <footer className="flex justify-between px-10 pb-10 max-md:flex-col">
      <div className="flex max-md:order-2 max-md:mt-12 flex-col justify-between capitalize">
        <div className="flex flex-col items-start gap-4">
          <div className="flex flex-col items-start gap-1">
            <a
              className="text-sm leading-5 tracking-[-0.01em] no-underline text-inherit"
              href={data?.phone?.link ?? ""}
            >
              {data?.phone?.text}
            </a>
            <FooterAddress address={data?.address} />
          </div>
          <RestaurantHours
            hours={data?.hours}
            className="items-start gap-2 text-left [&_.restaurant-hours-lines]:flex-col [&_.restaurant-hours-lines]:items-start [&_.restaurant-hours-lines]:gap-1 [&_.restaurant-hours-status]:text-sm"
          />
          <a
            className="text-sm leading-5 tracking-[-0.01em] lowercase no-underline text-inherit"
            href={data?.handle?.link ?? ""}
            target="_blank"
            rel="noopener noreferrer"
          >
            {data?.handle?.text}
          </a>
        </div>
        <p className="mt-0 text-left text-xs leading-4 tracking-[-0.01em] opacity-40 max-md:mt-6">
          {data?.tagline}
        </p>
      </div>
      {data?.image ? (
        <div className="piano relative order-1 mt-10 aspect-[183/197] w-[180px] max-md:order-1 max-md:mx-auto max-md:mb-[60px]">
          <Image
            className="absolute inset-0 size-full object-contain mix-blend-multiply"
            src={urlFor(data.image).url()}
            alt=""
            width={183}
            height={197}
          />
        </div>
      ) : null}
    </footer>
  )
}
