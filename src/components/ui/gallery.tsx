"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

const photos = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=800&fit=crop",
    caption: "Architecture of Commerce",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=800&fit=crop",
    caption: "Digital Workspace",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=800&fit=crop",
    caption: "Intelligent Systems",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=800&fit=crop",
    caption: "Data in Motion",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=800&fit=crop",
    caption: "Analytics Dashboard",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=800&fit=crop",
    caption: "Visual Intelligence",
  },
]

/* ───────── LIGHTBOX ───────── */
function Lightbox({
  index,
  onClose,
  onPrev,
  onNext,
}: {
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onPrev()
      if (e.key === "ArrowRight") onNext()
    }
    window.addEventListener("keydown", handler)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", handler)
      document.body.style.overflow = ""
    }
  }, [onClose, onPrev, onNext])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-2xl flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors"
      >
        <X size={20} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-foreground/30 hover:text-foreground hover:bg-foreground/[0.06] transition-all duration-300"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext() }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-foreground/30 hover:text-foreground hover:bg-foreground/[0.06] transition-all duration-300"
      >
        <ChevronRight size={24} />
      </button>

      <motion.div
        key={index}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="relative max-w-4xl w-full mx-6 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-sm shadow-2xl shadow-black/40 ring-1 ring-white/5">
          <img
            src={photos[index].src}
            alt={photos[index].caption}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <p className="mt-4 text-xs tracking-[0.2em] uppercase text-foreground/30 font-mono">
          {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")} — {photos[index].caption}
        </p>
      </motion.div>
    </motion.div>
  )
}

/* ───────── DESKTOP PHOTO ───────── */
function DesktopPhoto({
  src,
  caption,
  index,
  offsetX,
  offsetY,
  zIndex,
  isCenter,
  onSelect,
}: {
  src: string
  caption: string
  index: number
  offsetX: number
  offsetY: number
  zIndex: number
  isCenter: boolean
  onSelect: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el || !isCenter) return
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      setTilt({ x: -py * 6, y: px * 6 })
    }
    const onLeave = () => setTilt({ x: 0, y: 0 })
    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", onLeave)
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave) }
  }, [isCenter])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 60, damping: 16, delay: index * 0.1 }}
      className="absolute cursor-pointer group perspective-[800px]"
      style={{
        left: `calc(50% + ${offsetX}px)`,
        top: `calc(50% + ${offsetY}px)`,
        transform: `translate(-50%, -50%)`,
        zIndex,
        transformStyle: "preserve-3d",
      }}
      onClick={onSelect}
      whileHover={{ zIndex: 60, transition: { duration: 0.2 } }}
    >
      <div
        className="relative"
        style={{
          transform: isCenter ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : "none",
          transition: isCenter ? "transform 0.1s ease-out" : "none",
        }}
      >
        <div className="w-[220px] h-[220px] xl:w-[260px] xl:h-[260px] overflow-hidden rounded-sm shadow-2xl shadow-black/30 ring-1 ring-white/5 group-hover:ring-gold/30 transition-all duration-500">
          <img
            src={src}
            alt={caption}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        {/* Reflection */}
        <div
          className="absolute left-0 right-0 h-[40%] -bottom-[42%] overflow-hidden opacity-30 pointer-events-none"
          style={{
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 100%)",
          }}
        >
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover scale-y-[-1]"
            loading="lazy"
            aria-hidden="true"
          />
        </div>
        {/* Caption on hover */}
        <div className="absolute -bottom-10 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <span className="font-mono text-[9px] tracking-[0.2em] text-gold/60 uppercase">
            {caption}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/* ───────── MOBILE CAROUSEL ───────── */
function MobileCarousel({ onSelect }: { onSelect: (i: number) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    const idx = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth)
    setActive(Math.min(idx, photos.length - 1))
  }, [])

  const scrollTo = (i: number) => {
    scrollRef.current?.children[i]?.scrollIntoView({ behavior: "smooth", inline: "start" })
    setActive(i)
  }

  return (
    <div className="lg:hidden">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-6 px-6"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            className="snap-start shrink-0 w-[80vw] max-w-[320px]"
            onClick={() => onSelect(i)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 80, damping: 18 }}
              className="relative aspect-square overflow-hidden rounded-sm shadow-xl shadow-black/20 cursor-pointer group"
            >
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="font-mono text-[9px] tracking-[0.2em] text-white/60 uppercase">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="text-sm text-white/90 font-medium mt-1">{photo.caption}</p>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === active ? "w-6 bg-gold" : "w-1.5 bg-foreground/15 hover:bg-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

/* ───────── MAIN GALLERY ───────── */
export function PhotoGallery() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  const positions = [
    { x: -380, y: 10, z: 50 },
    { x: -190, y: 35, z: 40 },
    { x: 0, y: 5, z: 30 },
    { x: 190, y: 20, z: 20 },
    { x: 380, y: 45, z: 10 },
  ]

  return (
    <div className="relative">
      {/* Desktop spread */}
      <div className="hidden lg:block relative py-8">
        {/* Glow */}
        <div className="absolute left-1/2 top-[30%] -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-gold/5 blur-[150px] pointer-events-none" />

        <div
          className="relative h-[420px] flex items-center justify-center"
          style={{ perspective: "1000px" }}
        >
          {isLoaded && photos.slice(0, 5).map((photo, i) => (
            <DesktopPhoto
              key={photo.id}
              src={photo.src}
              caption={photo.caption}
              index={i}
              offsetX={positions[i].x}
              offsetY={positions[i].y}
              zIndex={positions[i].z}
              isCenter={i === 2}
              onSelect={() => setLightboxIdx(i)}
            />
          ))}
        </div>

        {/* Hint */}
        <p className="text-center text-[10px] tracking-[0.3em] uppercase text-foreground/15 mt-4">
          — click to explore —
        </p>
      </div>

      {/* Mobile carousel */}
      <MobileCarousel onSelect={(i) => setLightboxIdx(i)} />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            index={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
            onPrev={() => setLightboxIdx((lightboxIdx - 1 + photos.length) % photos.length)}
            onNext={() => setLightboxIdx((lightboxIdx + 1) % photos.length)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
