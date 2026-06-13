"use client"

import React, { useRef, useState, useEffect } from "react"
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion"
import { cn } from "@/lib/utils"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

type ImageItem = {
  id: number | string
  title: string
  desc: string
  url: string
  span: string
}

interface InteractiveImageBentoGalleryProps {
  imageItems: ImageItem[]
  title: string
  description: string
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 },
  },
}

const ImageModal = ({
  item,
  items,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  item: ImageItem
  items: ImageItem[]
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft" && hasPrev) onPrev()
      if (e.key === "ArrowRight" && hasNext) onNext()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose, onPrev, onNext, hasPrev, hasNext])

  const currentIndex = items.findIndex((i) => i.id === item.id)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="relative w-full max-w-5xl mx-2 md:mx-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden rounded-lg md:rounded-xl bg-black/40">
          <img
            src={item.url}
            alt={item.title}
            className="h-auto w-full object-contain max-h-[75vh] md:max-h-[85vh]"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 pt-12">
            <h3 className="text-base md:text-lg font-bold text-white">
              {item.title}
            </h3>
            <p className="text-xs md:text-sm text-white/70 mt-0.5">
              {item.desc}
            </p>
          </div>
        </div>

        {hasPrev && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-black/50 text-white/80 hover:bg-black/70 hover:text-white transition-all backdrop-blur-sm"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} className="md:w-6 md:h-6" />
          </button>
        )}
        {hasNext && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-black/50 text-white/80 hover:bg-black/70 hover:text-white transition-all backdrop-blur-sm"
            aria-label="Next image"
          >
            <ChevronRight size={20} className="md:w-6 md:h-6" />
          </button>
        )}

        <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white/60 text-xs">
          {currentIndex + 1} / {items.length}
        </div>
      </motion.div>

      <button
        onClick={onClose}
        className="absolute right-3 top-3 md:right-6 md:top-6 p-2 rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/60 transition-all backdrop-blur-sm"
        aria-label="Close image view"
      >
        <X size={22} className="md:w-6 md:h-6" />
      </button>
    </motion.div>
  )
}

const InteractiveImageBentoGallery: React.FC<
  InteractiveImageBentoGalleryProps
> = ({ imageItems, title, description }) => {
  const [selectedItem, setSelectedItem] = useState<ImageItem | null>(null)
  const [dragConstraint, setDragConstraint] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)

  const selectedIndex = selectedItem
    ? imageItems.findIndex((i) => i.id === selectedItem.id)
    : -1

  const handlePrev = () => {
    if (selectedIndex > 0) {
      setSelectedItem(imageItems[selectedIndex - 1])
    }
  }

  const handleNext = () => {
    if (selectedIndex < imageItems.length - 1) {
      setSelectedItem(imageItems[selectedIndex + 1])
    }
  }

  useEffect(() => {
    const calculateConstraints = () => {
      if (gridRef.current && containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const gridWidth = gridRef.current.scrollWidth
        const newConstraint = Math.min(0, containerWidth - gridWidth - 32)
        setDragConstraint(newConstraint)
      }
    }

    calculateConstraints()
    window.addEventListener("resize", calculateConstraints)
    return () => window.removeEventListener("resize", calculateConstraints)
  }, [imageItems])

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2], [30, 0])

  return (
    <section
      ref={targetRef}
      className="relative w-full overflow-hidden bg-background pb-8 sm:pb-16 md:py-16 lg:py-24"
    >
      <motion.div
        style={{ opacity, y }}
        className="px-5 sm:px-8 md:px-12 pt-16 md:pt-0 text-center md:text-left"
      >
        <div className="flex items-center gap-3 mb-3 md:hidden">
          <span className="w-8 h-px bg-gold/40" />
          <span className="font-mono text-[10px] text-foreground/20 tracking-widest uppercase">Gallery</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-2 md:mt-3 max-w-xl text-sm sm:text-base text-foreground/50 leading-relaxed">
          {description}
        </p>
      </motion.div>

      <div className="relative mt-6 md:mt-12">
        <div
          ref={containerRef}
          className="relative w-full cursor-grab active:cursor-grabbing overflow-visible"
        >
          <motion.div
            className="w-max px-5 md:px-8 select-none"
            drag="x"
            dragConstraints={{ left: dragConstraint, right: 0 }}
            dragElastic={0.08}
          >
            <motion.div
              ref={gridRef}
              className="grid auto-cols-[minmax(10rem,1fr)] sm:auto-cols-[minmax(13rem,1fr)] md:auto-cols-[minmax(16rem,1fr)] grid-flow-col gap-3 md:gap-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {imageItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className={cn(
                    "group relative flex h-full min-h-[10rem] sm:min-h-[13rem] md:min-h-[16rem] w-full min-w-[10rem] sm:min-w-[13rem] md:min-w-[16rem] cursor-pointer items-end overflow-hidden rounded-xl border border-white/5 bg-card shadow-sm transition-all duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    item.span,
                  )}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => setSelectedItem(item)}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedItem(item)}
                  tabIndex={0}
                  aria-label={`View ${item.title}`}
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Always-visible gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  {/* Hover-only additional overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Content */}
                  <div className="relative z-10 w-full">
                    <h3 className="text-sm md:text-base lg:text-lg font-bold text-white drop-shadow-sm">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-xs md:text-sm text-white/70 leading-snug max-w-[90%]">
                      {item.desc}
                    </p>
                  </div>
                  {/* Touch tap hint on mobile */}
                  <div className="absolute bottom-3 right-3 md:hidden opacity-40">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      <rect x="4" y="11" width="16" height="10" rx="2" />
                    </svg>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll hint gradient right edge */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background via-background/60 to-transparent hidden sm:block" />
      </div>

      {/* Drag hint text */}
      <p className="mt-4 text-center text-xs text-foreground/25 select-none md:hidden">
        swipe to explore &bull; tap to view
      </p>

      <AnimatePresence>
        {selectedItem && (
          <ImageModal
            item={selectedItem}
            items={imageItems}
            onClose={() => setSelectedItem(null)}
            onPrev={handlePrev}
            onNext={handleNext}
            hasPrev={selectedIndex > 0}
            hasNext={selectedIndex < imageItems.length - 1}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

export default InteractiveImageBentoGallery
