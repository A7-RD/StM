"use client"

import { useRef } from "react"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperType } from "swiper"

import { urlFor } from "@/sanity/lib/image"

type FoodImage = {
  title?: string
  ingredients?: string
  image?: unknown
}

type FoodGalleryProps = {
  data?: { images?: FoodImage[] }
}

export default function FoodGallery({ data }: FoodGalleryProps) {
  const swiperRef = useRef<SwiperType | null>(null)

  return (
    <div className="h-[480px] overflow-hidden md:h-[640px]">
      <Swiper
        loop
        centeredSlides
        slidesPerView="auto"
        spaceBetween={67}
        breakpoints={{
          0: { spaceBetween: 20 },
          769: { spaceBetween: 67 },
        }}
        speed={650}
        className="food-gallery"
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
      >
        {data?.images?.map((item, i) => (
          <SwiperSlide key={i}>
            {({ isActive }) => (
              <div className="food-gallery-slide-inner">
                <div
                  className="relative aspect-[4/5] w-full cursor-pointer"
                  onClick={() =>
                    !navigator.userAgent.toLowerCase().includes("firefox") &&
                    !isActive &&
                    swiperRef.current?.slideToLoop(i)
                  }
                >
                  {item.image ? (
                    <Image
                      className="absolute inset-0 size-full object-cover"
                      src={urlFor(item.image).url()}
                      alt={item.title ?? ""}
                      width={800}
                      height={600}
                    />
                  ) : null}
                </div>
                <div className="food-gallery-caption ds-text-small text-center normal-case leading-[100%] tracking-[-0.01em]">
                  <p className="opacity-40">{item.title}</p>
                  {item.ingredients ? (
                    <p className="capitalize opacity-40">{item.ingredients}</p>
                  ) : null}
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
