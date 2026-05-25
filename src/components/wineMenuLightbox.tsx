"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperType } from "swiper"
import { EffectFade, Thumbs } from "swiper/modules"
import { useLenis } from "lenis/react"
import "react-pdf/dist/Page/TextLayer.css"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "swiper/css/effect-fade"

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString()

type WineMenuLightboxProps = {
  pdfUrl?: string
  isOpen: boolean
  onClose: () => void
}

export default function WineMenuLightbox({
  pdfUrl,
  isOpen,
  onClose,
}: WineMenuLightboxProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [loadError, setLoadError] = useState<string | null>(null)
  const swiperRef = useRef<SwiperType | null>(null)
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    if (isOpen) lenis.stop()
    else lenis.start()
  }, [isOpen, lenis])

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="fixed inset-0 isolate z-50 bg-black/85 backdrop-blur-none"
        className="fixed top-1/2 left-1/2 z-50 flex max-h-[90vh] w-full max-w-[90vw] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-8 rounded-none border-0 bg-transparent p-0 text-white shadow-none ring-0"
      >
        <DialogTitle className="sr-only">Wine list</DialogTitle>
        <Button
          type="button"
          variant="ghost"
          className="absolute top-5 right-5 z-[210] border-0 bg-transparent p-0 text-[32px] leading-none text-white hover:bg-transparent hover:text-white"
          onClick={onClose}
        >
          &times;
        </Button>
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages: n }) => {
            setLoadError(null)
            setNumPages(n)
          }}
          onLoadError={() => setLoadError("Could not load the wine list.")}
          className="wine-lightbox__document flex flex-col items-center"
        >
          {loadError ? (
            <p
              className="ds-text m-0 max-w-md p-4 text-center text-white/90"
              role="alert"
            >
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
                    thumbsSwiper && !thumbsSwiper.destroyed
                      ? thumbsSwiper
                      : null,
                }}
                modules={[EffectFade, Thumbs]}
                className="wine-lightbox__swiper"
                onSwiper={(swiper) => {
                  swiperRef.current = swiper
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              >
                {Array.from({ length: numPages }, (_, i) => (
                  <SwiperSlide key={i}>
                    <div
                      className="wine-lightbox__slide"
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
              <div className="mt-4 w-full max-w-[600px] shrink-0 max-md:hidden">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  slidesPerView={Math.min(numPages, 4)}
                  spaceBetween={10}
                  watchSlidesProgress
                  modules={[Thumbs]}
                  className="wine-lightbox__thumbs"
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
              <div className="ds-text-small mt-3 text-center normal-case tracking-[0.05em] text-white/70 max-md:mt-4">
                {activeIndex + 1}/{numPages}
              </div>
            </>
          ) : null}
        </Document>
      </DialogContent>
    </Dialog>
  )
}
