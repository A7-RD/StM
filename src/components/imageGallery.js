"use client";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectFade, Autoplay } from "swiper/modules";
import "swiper/css/effect-fade";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

export default function ImageGallery({ data }) {
  const swiperRef = useRef(null);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) {
      swiperRef.current?.slidePrev();
    } else {
      swiperRef.current?.slideNext();
    }
  };

  return (
    <Swiper
      slidesPerView={1}
      loop
      speed={650}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      modules={[Pagination, EffectFade, Autoplay]}
      pagination={{ clickable: true }}
      className="image-gallery"
      onSwiper={(swiper) => (swiperRef.current = swiper)}
    >
      {data?.images?.map((item, i) => (
        <SwiperSlide key={i}>
          <div className="ratio-4-5 pos-rel" onClick={handleClick}>
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
