"use client"

import { useState, useRef, useCallback } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperType } from "swiper"
import { EffectFade, Thumbs } from "swiper/modules"
import "react-pdf/dist/Page/TextLayer.css"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "swiper/css/effect-fade"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString()

type WineMenuInlineProps = {
  pdfUrl?: string
}

export default function WineMenuInline({ pdfUrl }: WineMenuInlineProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [loadError, setLoadError] = useState<string | null>(null)
  const swiperRef = useRef<SwiperType | null>(null)

  const handleSlideClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      if (x < rect.width / 2) swiperRef.current?.slidePrev()
      else swiperRef.current?.slideNext()
    },
    [],
  )

  if (!pdfUrl) return null

  return (
    <div className="wine-menu-inline flex w-full flex-col items-center pt-12 max-md:pt-8">
      <Document
        file={pdfUrl}
        onLoadSuccess={({ numPages: n }) => {
          setLoadError(null)
          setNumPages(n)
        }}
        onLoadError={() => setLoadError("Could not load the wine list.")}
        className="wine-menu-inline__document"
      >
        {loadError ? (
          <p className="m-0 max-w-md p-4 text-center text-base leading-normal" role="alert">
            {loadError}
          </p>
        ) : null}
        {numPages && !loadError ? (
          <>
            <Swiper
              slidesPerView={1}
              speed={350}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              loop
              observer
              observeParents
              thumbs={{
                swiper:
                  thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              modules={[EffectFade, Thumbs]}
              className="wine-menu-inline__swiper"
              onSwiper={(swiper) => {
                swiperRef.current = swiper
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            >
              {Array.from({ length: numPages }, (_, i) => (
                <SwiperSlide key={i}>
                  <div
                    className="wine-menu-inline__slide"
                    onClick={handleSlideClick}
                  >
                    <Page
                      pageNumber={i + 1}
                      width={700}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="wine-menu-inline__thumbs-wrap mt-4 w-[min(600px,90vw)] max-md:hidden">
              <Swiper
                onSwiper={setThumbsSwiper}
                slidesPerView={Math.min(numPages, 4)}
                spaceBetween={10}
                watchSlidesProgress
                modules={[Thumbs]}
                className="wine-menu-inline__thumbs"
              >
                {Array.from({ length: numPages }, (_, i) => (
                  <SwiperSlide key={i}>
                    <Page
                      pageNumber={i + 1}
                      width={90}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="mt-3 text-center text-sm tracking-[0.05em] opacity-60 max-md:mt-4">
              {activeIndex + 1}/{numPages}
            </div>
          </>
        ) : null}
      </Document>
    </div>
  )
}
