"use client"

import { useState, useEffect, useCallback } from "react"
import { useLang } from "@/contexts/LanguageContext"
import { FlipReveal, FlipRevealItem } from "@/components/ui/flip-reveal"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

const categories = [
  { value: "all", label: "All" },
  { value: "nature", label: "Landscape" },
  { value: "city", label: "Urban" },
  { value: "portrait", label: "Portrait" },
  { value: "event", label: "Archive" },
]

const galleryImages = [
  { id: 1, src: "/img/gallery/gal-1.webp", cat: "nature" },
  { id: 2, src: "/img/gallery/gal-2.webp", cat: "city" },
  { id: 3, src: "/img/gallery/gal-3.webp", cat: "portrait" },
  { id: 4, src: "/img/gallery/gal-4.webp", cat: "event" },
  { id: 5, src: "/img/gallery/gal-5.webp", cat: "nature" },
  { id: 6, src: "/img/gallery/gal-6.webp", cat: "city" },
  { id: 7, src: "/img/gallery/gal-7.webp", cat: "portrait" },
  { id: 8, src: "/img/gallery/gal-8.webp", cat: "event" },
  { id: 9, src: "/img/gallery/gal-9.webp", cat: "nature" },
  { id: 10, src: "/img/gallery/gal-10.webp", cat: "city" },
  { id: 11, src: "/img/gallery/gal-11.webp", cat: "portrait" },
  { id: 12, src: "/img/gallery/gal-12.webp", cat: "event" },
  { id: 13, src: "/img/gallery/gal-13.webp", cat: "nature" },
  { id: 14, src: "/img/gallery/gal-14.webp", cat: "event" },
]

export function GalleryPage() {
  const { t } = useLang()
  const [key, setKey] = useState("all")
  const [previewIdx, setPreviewIdx] = useState<number | null>(null)

  const close = useCallback(() => setPreviewIdx(null), [])

  useEffect(() => {
    if (previewIdx === null) return
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowRight") setPreviewIdx(i => i !== null ? (i + 1) % galleryImages.length : 0)
      if (e.key === "ArrowLeft") setPreviewIdx(i => i !== null ? (i - 1 + galleryImages.length) % galleryImages.length : 0)
    }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [previewIdx, close])

  return (
    <div className="pt-20 md:pt-24 bg-background relative min-h-screen lg:pr-20 flex flex-col items-center px-4 md:px-8 pb-12 contain-content">
      <div className="w-full max-w-6xl">
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-4 mb-2">
            <span className="section-marker">// {t("gallery.heading")}</span>
            <span className="w-12 h-px bg-gradient-to-r from-gold/40 to-transparent" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
            {t("gallery.title")}
          </h1>
          <p className="text-sm text-foreground/50 max-w-2xl leading-relaxed">
            {t("gallery.description")}
          </p>
        </div>

        <ToggleGroup
          type="single"
          className="bg-background rounded-md border border-border p-1 mb-8 flex-wrap"
          value={key}
          onValueChange={(e) => e && setKey(e)}
        >
          {categories.map((cat) => (
            <ToggleGroupItem key={cat.value} value={cat.value} className="sm:px-4 text-xs sm:text-sm">
              {cat.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <FlipReveal
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4"
          keys={[key]}
          showClass="flex"
          hideClass="hidden"
        >
          {galleryImages.map((img) => (
            <FlipRevealItem
              key={img.id}
              flipKey={img.cat}
              className="relative group overflow-hidden rounded-sm border border-border/10 bg-card cursor-pointer"
              onClick={() => setPreviewIdx(galleryImages.indexOf(img))}
            >
              <img
                src={img.src}
                alt=""
                className="w-full h-40 sm:h-48 md:h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </FlipRevealItem>
          ))}
        </FlipReveal>
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
              <img
                src={galleryImages[previewIdx].src}
                alt=""
                className="w-full h-full object-contain drop-shadow-2xl"
                loading="lazy"
              />

              <button onClick={close} className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center bg-black/60 hover:bg-black/80 transition-colors rounded-full border border-white/10" aria-label="Close">
                <X size={14} className="text-white" />
              </button>

              <button onClick={(e) => { e.stopPropagation(); setPreviewIdx((previewIdx - 1 + galleryImages.length) % galleryImages.length) }} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center bg-black/50 hover:bg-black/70 transition-colors rounded-full border border-white/10" aria-label="Previous">
                <ChevronLeft size={16} className="text-white/80" />
              </button>

              <button onClick={(e) => { e.stopPropagation(); setPreviewIdx((previewIdx + 1) % galleryImages.length) }} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center bg-black/50 hover:bg-black/70 transition-colors rounded-full border border-white/10" aria-label="Next">
                <ChevronRight size={16} className="text-white/80" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/70 backdrop-blur-md px-5 py-3.5 border border-white/10 rounded-sm pointer-events-none flex items-center justify-between">
                <span className="text-xs text-white/50">{galleryImages[previewIdx].cat}</span>
                <span className="font-mono text-[10px] text-white/30 tabular-nums ml-4">{previewIdx + 1} / {galleryImages.length}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
