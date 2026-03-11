"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectFade, Autoplay } from "swiper/modules";
import "swiper/css/effect-fade";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

export default function ImageGallery({ data }) {
  return (
    <Swiper
      grabCursor
      slidesPerView={1}
      loop
      speed={650}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      modules={[Pagination, EffectFade, Autoplay]}
      pagination={{ clickable: true }}
      className="image-gallery"
    >
      {data?.images?.map((item, i) => (
        <SwiperSlide key={i}>
          <div className="ratio-4-5 pos-rel">
            <Image
              className="bg-image"
              src={urlFor(item).url()}
              alt=""
              width={800}
              height={600}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
