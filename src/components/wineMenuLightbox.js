"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Thumbs } from "swiper/modules";
import { useLenis } from "lenis/react";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "swiper/css/effect-fade";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function WineMenuLightbox({ pdfUrl, isOpen, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadError, setLoadError] = useState(null);
  const swiperRef = useRef(null);
  const lenis = useLenis();

  useEffect(() => {
    if (isOpen) {
      queueMicrotask(() => {
        setMounted(true);
        setNumPages(null);
        setLoadError(null);
      });
      let innerRaf = 0;
      const outerRaf = requestAnimationFrame(() => {
        innerRaf = requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        cancelAnimationFrame(outerRaf);
        cancelAnimationFrame(innerRaf);
      };
    }
    queueMicrotask(() => setVisible(false));
  }, [isOpen]);

  const handleTransitionEnd = useCallback(() => {
    if (!visible) {
      setMounted(false);
      setNumPages(null);
    }
  }, [visible]);

  useEffect(() => {
    if (!lenis) return;
    if (isOpen) lenis.stop();
    else lenis.start();
  }, [isOpen, lenis]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleSlideClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) swiperRef.current?.slidePrev();
    else swiperRef.current?.slideNext();
  }, []);

  if (!pdfUrl || !mounted) return null;

  return (
    <div
      className={`wine-lightbox${visible ? " wine-lightbox--visible" : ""}`}
      onTransitionEnd={handleTransitionEnd}
    >
      <button className="wine-lightbox__close" onClick={onClose}>
        &times;
      </button>
      <div
        className="wine-lightbox__content"
        onClick={(e) => e.stopPropagation()}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => {
            setLoadError(null);
            setNumPages(numPages);
          }}
          onLoadError={() => setLoadError("Could not load the wine list.")}
          className="wine-lightbox__document"
        >
          {loadError && (
            <p className="wine-lightbox__error" role="alert">
              {loadError}
            </p>
          )}
          {numPages && !loadError && (
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
                onSwiper={(swiper) => (swiperRef.current = swiper)}
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
              <div className="wine-lightbox__thumbs-doc">
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
              <div className="wine-lightbox__index">
                {activeIndex + 1}/{numPages}
              </div>
            </>
          )}
        </Document>
      </div>
    </div>
  );
}
