"use client";
import { useState, useRef, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Thumbs } from "swiper/modules";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "swiper/css/effect-fade";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function WineMenuInline({ pdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadError, setLoadError] = useState(null);
  const swiperRef = useRef(null);

  const handleSlideClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) swiperRef.current?.slidePrev();
    else swiperRef.current?.slideNext();
  }, []);

  if (!pdfUrl) return null;

  return (
    <div className="wine-menu-inline">
      <Document
        file={pdfUrl}
        onLoadSuccess={({ numPages }) => {
          setLoadError(null);
          setNumPages(numPages);
        }}
        onLoadError={() => setLoadError("Could not load the wine list.")}
        className="wine-menu-inline__document"
      >
        {loadError && (
          <p className="wine-menu-inline__error" role="alert">
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
                  thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              modules={[EffectFade, Thumbs]}
              className="wine-menu-inline__swiper"
              onSwiper={(swiper) => (swiperRef.current = swiper)}
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
            <div className="wine-menu-inline__thumbs-wrap">
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
            <div className="wine-menu-inline__index">
              {activeIndex + 1}/{numPages}
            </div>
          </>
        )}
      </Document>
    </div>
  );
}
