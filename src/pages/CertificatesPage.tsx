import { useRef, useState, useEffect, useCallback } from "react"
import { certificates } from "@/data/certificates"
import { useLang } from "@/contexts/LanguageContext"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, EffectCoverflow } from "swiper/modules"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import "swiper/css"
import "swiper/css/effect-coverflow"

export function CertificatesPage() {
  const { t, tData } = useLang()
  const swiperRef = useRef<any>(null)
  const [realIdx, setRealIdx] = useState(0)
  const [previewIdx, setPreviewIdx] = useState<number | null>(null)

  const certItems = (tData("certificates.items") as {
    title: string; issuer: string; description: string; skills: string[];
  }[]) || []

  const close = useCallback(() => setPreviewIdx(null), [])

  useEffect(() => {
    if (previewIdx === null) return
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowRight") setPreviewIdx(i => i !== null ? (i + 1) % certificates.length : 0)
      if (e.key === "ArrowLeft") setPreviewIdx(i => i !== null ? (i - 1 + certificates.length) % certificates.length : 0)
    }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [previewIdx, close])

  return (
    <div className="pt-20 md:pt-24 bg-background relative h-screen lg:pr-20 flex flex-col">
      <span className="section-number hidden md:block">04</span>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative z-10 px-6 md:px-12 pt-6 md:pt-10 pb-2 shrink-0">
        <div className="flex items-center gap-4 mb-2">
          <span className="section-marker">// {t("certificates.heading")}</span>
          <span className="w-12 h-px bg-gradient-to-r from-gold/40 to-transparent" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          {t("certificates.title")}
        </h1>
      </div>

      <div className="relative flex-1 flex items-center z-10 overflow-visible">
        <div className="w-full overflow-visible">
          <Swiper
            ref={swiperRef}
            modules={[Autoplay, EffectCoverflow]}
            effect="coverflow"
            grabCursor
            centeredSlides
            loop
            spaceBetween={60}
            slidesPerView="auto"
            autoplay={{ delay: 2800, disableOnInteraction: false, pauseOnMouseEnter: false }}
            speed={700}
            coverflowEffect={{
              rotate: 10,
              stretch: 0,
              depth: 500,
              modifier: 1.2,
              slideShadows: false,
            }}
            onSlideChange={(s) => setRealIdx(s.realIndex)}
            className="overflow-visible"
          >
            {certificates.map((cert) => {
              const item = certItems[cert.transIdx] || { title: "", issuer: "" }
              return (
                <SwiperSlide
                  key={cert.id}
                  onClick={() => setPreviewIdx(cert.transIdx)}
                  className="overflow-visible"
                  style={{ width: 500 }}
                >
                  <div className="select-none cursor-pointer relative bg-gradient-to-b from-foreground/[0.03] to-background rounded-lg overflow-hidden border border-foreground/[0.06] shadow-lg transition-shadow duration-500">
                    <img
                      src={cert.image}
                      alt={item.title}
                      className="w-full block"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center gap-4 pb-4 shrink-0">
        <div className="flex items-center gap-2">
          {certificates.map((_, i) => (
            <button
              key={i}
              onClick={() => swiperRef.current?.swiper?.slideToLoop(i)}
              className="transition-all duration-500"
              style={{
                width: i === realIdx ? 28 : 5,
                height: 2,
                background: i === realIdx ? "var(--accent)" : "rgba(255,255,255,0.08)",
                boxShadow: i === realIdx ? "0 0 6px var(--accent)" : "none",
                borderRadius: 0,
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <span className="font-mono text-[10px] text-foreground/20 tabular-nums">
          {String(realIdx + 1).padStart(2, "0")} / {String(certificates.length).padStart(2, "0")}
        </span>
      </div>

      <AnimatePresence>
        {previewIdx !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            role="dialog" aria-modal="true"
          >
            <motion.div
              className="relative w-full h-full max-w-6xl max-h-[95vh] flex items-center justify-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={certificates[previewIdx].image} alt="" className="w-full h-full object-contain drop-shadow-2xl" loading="lazy" />

              <button onClick={close} className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center bg-black/60 hover:bg-black/80 transition-colors rounded-full border border-white/10" aria-label="Close">
                <X size={14} className="text-white" />
              </button>

              <button onClick={(e) => { e.stopPropagation(); setPreviewIdx((previewIdx - 1 + certificates.length) % certificates.length) }} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center bg-black/50 hover:bg-black/70 transition-colors rounded-full border border-white/10" aria-label="Previous">
                <ChevronLeft size={16} className="text-white/80" />
              </button>

              <button onClick={(e) => { e.stopPropagation(); setPreviewIdx((previewIdx + 1) % certificates.length) }} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center bg-black/50 hover:bg-black/70 transition-colors rounded-full border border-white/10" aria-label="Next">
                <ChevronRight size={16} className="text-white/80" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/70 backdrop-blur-md px-5 py-3.5 border border-white/10 rounded-sm pointer-events-none flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm md:text-lg font-bold text-white truncate">{certItems[previewIdx]?.title}</h3>
                  <p className="text-xs text-white/50 truncate">{certItems[previewIdx]?.issuer} · {certificates[previewIdx].year}</p>
                </div>
                <span className="font-mono text-[10px] text-white/30 tabular-nums ml-4 shrink-0">{previewIdx + 1} / {certificates.length}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
