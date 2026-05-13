"use client"

import { useRef } from "react"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperType } from "swiper"
import { Pagination, EffectFade, Autoplay } from "swiper/modules"
import "swiper/css/effect-fade"

import { urlFor } from "@/sanity/lib/image"

type ImageGalleryProps = {
  data?: { images?: unknown[] }
}

export default function ImageGallery({ data }: ImageGalleryProps) {
  const swiperRef = useRef<SwiperType | null>(null)

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    if (x < rect.width / 2) swiperRef.current?.slidePrev()
    else swiperRef.current?.slideNext()
  }

  return (
    <div className="mx-auto box-border w-full max-w-[400px] shrink-0 max-md:max-w-none max-md:px-[35px]">
      <Swiper
        slidesPerView={1}
        loop
        speed={650}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        modules={[Pagination, EffectFade, Autoplay]}
        pagination={{ clickable: true }}
        className="image-gallery w-full select-none"
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
      >
        {data?.images?.map((item, i) => (
          <SwiperSlide key={i}>
            <div
              className="relative aspect-[4/5] w-full cursor-pointer"
              onClick={handleClick}
            >
              <Image
                className="absolute inset-0 size-full object-cover"
                src={urlFor(item).url()}
                alt=""
                width={800}
                height={600}
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
