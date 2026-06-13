"use client"

import { useState, useEffect, useRef } from "react"
import {
  Award, Cloud, Shield, Code2, Globe, Lock, Bug,
} from "lucide-react"

const iconMap = [Award, Cloud, Shield, Code2, Globe, Lock, Bug]

export interface CertItem {
  title: string
  issuer: string
  description: string
  skills: string[]
}

interface InteractiveSelectorProps {
  items: CertItem[]
  years: string[]
  credentials: string[]
  images: string[]
  onPreview?: (index: number) => void
}

export default function InteractiveSelector({ items, years, credentials, images, onPreview }: InteractiveSelectorProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const timers = items.map((_, i) =>
      setTimeout(() => setAnimatedOptions((prev) => [...prev, i]), 180 * i),
    )
    return () => timers.forEach(clearTimeout)
  }, [items])

  useEffect(() => {
    const el = panelRefs.current[activeIndex]
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" })
    }
  }, [activeIndex])

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      {/* Scroll hint on mobile */}
      <div className="flex md:hidden items-center gap-1.5 mb-3">
        <span className="font-mono text-[8px] text-foreground/20 tracking-wider uppercase">Swipe</span>
        <span className="w-4 h-px bg-foreground/10" />
        <span className="w-1.5 h-1.5 rotate-45 border border-foreground/20" />
      </div>

      <div className="relative w-full max-w-[1100px]">
        {/* Right edge gradient fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background via-background/80 to-transparent z-10 md:hidden" />

        <div className="flex w-full h-[380px] md:h-[480px] items-stretch overflow-x-auto md:overflow-hidden touch-pan-x rounded-sm border border-border/[0.04] scroll-smooth"
          ref={containerRef}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
        {items.map((item, index) => {
          const isActive = activeIndex === index
          const Icon = iconMap[index % iconMap.length]
          return (
            <div
              key={index}
              ref={(el) => { panelRefs.current[index] = el }}
              className="relative flex flex-col justify-end overflow-hidden transition-all duration-300 ease-out cursor-pointer select-none"
              style={{
                minWidth: "80px",
                flex: isActive ? "1 1 85%" : "0 0 80px",
                zIndex: isActive ? 10 : 1,
                borderRight: index < items.length - 1 ? "1px solid" : "none",
                borderColor: "var(--color-border)",
                opacity: animatedOptions.includes(index) ? 1 : 0,
                transform: animatedOptions.includes(index) ? "translateX(0)" : "translateX(-30px)",
                willChange: "flex-grow",
              }}
              onClick={() => {
                if (index !== activeIndex) {
                  setActiveIndex(index)
                } else if (isActive) {
                  onPreview?.(index)
                }
              }}
              onMouseEnter={() => setActiveIndex(index)}
              onTouchStart={() => { if (index !== activeIndex) setActiveIndex(index) }}
            >
              <div
                className="absolute inset-0 transition-all duration-300 ease-out"
                style={{
                  background: isActive
                    ? "linear-gradient(180deg, var(--color-card) 0%, var(--color-muted) 100%)"
                    : "var(--color-background)",
                }}
              />

              {isActive && (
                <>
                  <span className="absolute top-2 left-2 w-4 h-4 border-t border-l border-gold/30 z-10" />
                  <span className="absolute top-2 right-2 w-4 h-4 border-t border-r border-gold/30 z-10" />
                  <span className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-gold/30 z-10" />
                  <span className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-gold/30 z-10" />
                </>
              )}

              <div
                className="absolute left-0 right-0 pointer-events-none transition-all duration-300 ease-out"
                style={{
                  bottom: isActive ? "0" : "-40px",
                  height: "120px",
                  boxShadow: isActive
                    ? "inset 0 -120px 120px -120px rgba(0,0,0,0.5), inset 0 -120px 120px -80px rgba(0,0,0,0.3)"
                    : "inset 0 -120px 0px -120px rgba(0,0,0,0.5), inset 0 -120px 0px -80px rgba(0,0,0,0.3)",
                }}
              />

              <div className="absolute left-0 right-0 bottom-4 md:bottom-5 flex items-center justify-start h-12 pointer-events-none px-3 md:px-4 gap-2 md:gap-3 z-10">
                <div
                  className="min-w-[40px] md:min-w-[44px] max-w-[40px] md:max-w-[44px] h-[40px] md:h-[44px] flex items-center justify-center rounded-full shrink-0"
                  style={{
                    background: isActive ? "var(--color-accent)" : "var(--color-muted)",
                    boxShadow: isActive ? "0 0 20px rgba(var(--accent-rgb), 0.3)" : "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Icon size={18} className={isActive ? "text-ebony" : "text-foreground/40"} />
                </div>

                <div className="text-foreground whitespace-pre relative overflow-hidden min-w-0">
                  <div
                    className="font-bold text-sm md:text-lg transition-all duration-300 ease-out truncate"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "translateX(0)" : "translateX(25px)",
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    className="text-xs md:text-sm text-foreground/50 transition-all duration-300 ease-out truncate"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "translateX(0)" : "translateX(25px)",
                    }}
                  >
                    {item.issuer} · {years[index]}
                  </div>
                </div>
              </div>

              {isActive && (
                <div className="absolute top-12 md:top-14 left-4 md:left-6 right-4 md:right-6 z-10 animate-fade-slide-up flex flex-col" style={{ maxHeight: "calc(100% - 80px)" }}>
                  <div
                    className="relative mb-2 md:mb-3 rounded-sm overflow-hidden active:scale-[0.98] transition-transform shrink-0"
                    onClick={(e) => { e.stopPropagation(); onPreview?.(index) }}
                  >
                    <div className="relative bg-card p-1 md:p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                      <img
                        src={images[index]}
                        alt={item.title}
                        className="w-full h-36 md:h-52 object-cover rounded-sm"
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 w-4 h-4 border-t border-l border-gold/20 z-10" />
                      <span className="absolute top-2 right-2 w-4 h-4 border-t border-r border-gold/20 z-10" />
                      <span className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-gold/20 z-10" />
                      <span className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-gold/20 z-10" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 md:bg-black/0 md:hover:bg-black/20">
                      <span className="bg-black/50 text-white/90 text-[10px] md:text-xs tracking-wider uppercase px-3 py-1.5 rounded-sm backdrop-blur-sm">
                        Tap to Preview
                      </span>
                    </div>
                  </div>
                  <div className="overflow-y-auto flex-1 min-h-0">
                    <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2">
                      {item.skills.map((s) => (
                        <span
                          key={s}
                          className="font-mono text-[8px] md:text-[9px] tracking-wider text-gold/50 border border-gold/20 px-2 py-0.5 md:px-2.5 md:py-1"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] md:text-sm text-foreground/50 leading-relaxed line-clamp-3 md:line-clamp-4">
                      {item.description}
                    </p>
                    <div className="mt-2 pt-2 border-t border-border/[0.06] flex items-center justify-between">
                      <span className="font-mono text-[7px] md:text-[8px] tracking-wider text-foreground/20 truncate">
                        {credentials[index]}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); onPreview?.(index) }}
                        className="font-mono text-[8px] md:text-[9px] tracking-wider text-gold/50 hover:text-gold/80 transition-colors uppercase shrink-0 ml-2"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      </div>
    </div>
  )
}
