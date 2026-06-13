import { useEffect, useRef, useState } from "react"
import { experiences } from "@/data/portfolio"
import { GraduationCap, Building2, Shield, Brain, Network, Calendar, ArrowUpRight } from "lucide-react"
import { useLang } from "@/contexts/LanguageContext"

const roleIcons = [Building2, Shield, Brain, Network]

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, revealed }
}

export function ExperiencePage() {
  const { t, tData } = useLang()
  const expItems = (tData("experience.items") as {
    role: string; company: string; period: string;
    description: string; deliverables: string[];
  }[]) || []
  const certList = (tData("experience.certList") as {
    title: string; issuer: string; year: string;
  }[]) || []

  return (
    <div className="pt-20 md:pt-24 bg-background relative min-h-screen lg:pr-20">
      <span className="section-number hidden md:block">03</span>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 relative z-10">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <div className="flex items-center gap-4 mb-6">
            <span className="section-marker">// {t("experience.heading")}</span>
            <span className="w-12 h-px bg-gradient-to-r from-gold/40 to-transparent" />
          </div>
          <div className="relative">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground leading-[1.05] tracking-tight">
              {t("experience.title")}
            </h1>
            <div className="mt-4 w-24 h-[2px] bg-gradient-to-r from-gold/60 to-transparent" />
          </div>
        </div>

        {/* Timeline */}
        <section aria-label="Experience timeline" className="relative mb-24">
          {/* Vertical gold line (desktop) */}
          <div className="hidden md:block absolute left-[72px] top-0 bottom-0 w-px bg-gradient-to-b from-gold/30 via-foreground/[0.05] to-transparent" />

          <div className="space-y-0">
            {experiences.map((exp, i) => {
              const item = expItems[exp.transIdx] || { role: "", company: "", period: "", description: "", deliverables: [] }
              const { ref, revealed } = useReveal(0.1)
              const Icon = roleIcons[i] || Building2
              const isLast = i === experiences.length - 1

              return (
                <div
                  key={exp.floor}
                  ref={ref}
                  className="relative group pb-0"
                >
                  <div
                    className="relative flex gap-6 md:gap-10"
                    style={{
                      transition: `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 150}ms`,
                      opacity: revealed ? 1 : 0,
                      transform: revealed ? "translateY(0)" : "translateY(40px)",
                    }}
                  >
                    {/* Left: icon + connecting line */}
                    <div className="hidden md:flex flex-col items-center w-[72px] shrink-0 pt-8">
                      <div className="relative">
                        {/* Glow behind icon */}
                        <div className="absolute inset-0 rounded-full bg-gold/10 scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-center justify-center w-12 h-12 rounded-full border-2 border-gold/25 bg-gradient-to-br from-background to-foreground/[0.02] group-hover:border-gold group-hover:bg-gold/[0.08] transition-all duration-500 z-10">
                          <Icon size={18} className="text-gold/40 group-hover:text-gold transition-colors duration-500" />
                        </div>
                      </div>
                      {!isLast && (
                        <div className="w-px flex-1 bg-gradient-to-b from-gold/15 to-transparent min-h-[40px]" />
                      )}
                    </div>

                    {/* Right: card */}
                    <div className="flex-1 min-w-0 pb-12 md:pb-16">
                      {/* Mobile indicator */}
                      <div className="md:hidden flex items-center gap-3 mb-4">
                        <div className="relative">
                          <div className="w-9 h-9 rounded-full border border-gold/25 flex items-center justify-center bg-gradient-to-br from-background to-foreground/[0.02]">
                            <Icon size={14} className="text-gold/60" />
                          </div>
                        </div>
                        <span className="font-mono text-[10px] text-gold/40 tracking-widest uppercase">Floor {exp.floor}</span>
                      </div>

                      <div className="relative bg-gradient-to-b from-foreground/[0.02] to-transparent border border-border/10 group-hover:border-gold/20 transition-all duration-500 glow-gold-hover">
                        {/* Top shimmer accent */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

                        <div className="p-6 md:p-8">
                          {/* Meta row */}
                          <div className="flex items-center gap-3 mb-4 flex-wrap">
                            <span className="font-mono text-[9px] tracking-[0.2em] text-gold/60 uppercase bg-gold/[0.06] px-3 py-1.5 border border-gold/10">
                              <Calendar size={10} className="inline mr-1.5 -mt-0.5" />
                              {item.period}
                            </span>
                            <span className="w-px h-3 bg-foreground/[0.06]" />
                            <span className="text-[10px] text-foreground/30 uppercase tracking-wider flex items-center gap-1.5">
                              <Building2 size={10} className="text-gold/30" />
                              {item.company}
                            </span>
                          </div>

                          {/* Role */}
                          <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-gold transition-colors duration-500 mb-3 tracking-tight">
                            {item.role}
                          </h3>

                          {/* Description */}
                          <p className="text-sm text-foreground/40 leading-[1.8] max-w-3xl mb-6">
                            {item.description}
                          </p>

                          {/* Deliverables */}
                          <div className="flex flex-wrap gap-2">
                            {item.deliverables.map((d) => (
                              <span
                                key={d}
                                className="flex items-center gap-1.5 font-mono text-[9px] tracking-wider text-foreground/30 border border-border/10 px-3 py-1.5 group-hover:border-gold/20 group-hover:text-gold/50 group-hover:bg-gold/[0.03] transition-all duration-500"
                              >
                                <span className="w-1 h-1 bg-gold/50 rounded-full" />
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Foundation marker */}
          <div className="hidden md:flex items-center gap-4 pl-[72px] pt-4 pb-8">
            <div className="relative">
              <div className="w-4 h-4 border border-gold/30 rotate-45 group-hover:border-gold/60 transition-colors duration-500" />
              <div className="absolute inset-0 w-4 h-4 border border-gold/10 rotate-45 animate-pulse-accent" style={{ animationDuration: "3s" }} />
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-foreground/20 tracking-widest uppercase">
                {t("experience.foundation")} — 2021
              </span>
              <span className="w-16 h-px bg-gradient-to-r from-gold/20 to-transparent" />
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section aria-label="Certifications" className="contain-content">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-gold/[0.08] to-gold/[0.02] border border-gold/10">
              <GraduationCap size={15} className="text-gold/60" />
            </div>
            <span className="section-marker">// {t("experience.certifications")}</span>
            <span className="w-8 h-px bg-foreground/10" />
            <span className="font-mono text-[8px] text-foreground/15">{certList.length} Credentials</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certList.map((cert, i) => {
              const { ref, revealed } = useReveal(0.1)
              return (
                <div
                  key={cert.title}
                  ref={ref}
                  className={`relative p-6 border border-border/10 bg-gradient-to-b from-foreground/[0.01] to-transparent hover:border-gold/20 hover:bg-gold/[0.01] transition-all duration-500 group overflow-hidden glow-gold-hover ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  {/* Corner decorations */}
                  <span className="absolute top-2 left-2 w-4 h-4 border-t border-l border-gold/10 group-hover:border-gold/30 transition-colors duration-500" />
                  <span className="absolute top-2 right-2 w-4 h-4 border-t border-r border-gold/10 group-hover:border-gold/30 transition-colors duration-500" />
                  <span className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-gold/10 group-hover:border-gold/30 transition-colors duration-500" />
                  <span className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-gold/10 group-hover:border-gold/30 transition-colors duration-500" />

                  {/* Top hover accent */}
                  <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Background gradient */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-gold/[0.03] to-transparent" />

                  <span className="relative font-mono text-[10px] text-gold/40 tracking-wider">{cert.year}</span>
                  <h4 className="relative text-foreground text-sm font-medium mt-2.5 mb-1.5 group-hover:text-gold transition-colors duration-300 tracking-tight">
                    {cert.title}
                  </h4>
                  <p className="relative text-[11px] text-foreground/30 tracking-wide">{cert.issuer}</p>

                  {/* Bottom right arrow */}
                  <ArrowUpRight size={12} className="absolute bottom-4 right-4 text-gold/0 group-hover:text-gold/25 transition-all duration-500 -rotate-45 group-hover:rotate-0" />
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
