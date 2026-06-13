import { useEffect, useRef, useState } from "react"
import { personalInfo, principles, skills } from "@/data/portfolio"
import { MapPin, Mail, Calendar, Quote, Code2, Hammer, Lightbulb, Ruler, ArrowUpRight, Shield, Search, Wifi, Globe, Database, Radio } from "lucide-react"
import { useLang } from "@/contexts/LanguageContext"
import { SiReact, SiNextdotjs, SiTailwindcss, SiVuedotjs, SiAstro, SiExpress, SiNodedotjs, SiBootstrap, SiBurpsuite, SiWireshark } from "react-icons/si"

const principleIcons = [Code2, Hammer, Lightbulb, Ruler]

const toolIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "React JS": SiReact,
  "Next JS": SiNextdotjs,
  "Tailwind": SiTailwindcss,
  "Vue": SiVuedotjs,
  "Astro": SiAstro,
  "Express JS": SiExpress,
  "Node JS": SiNodedotjs,
  "Bootstrap": SiBootstrap,
  "Burp Suite": SiBurpsuite,
  "Wireshark": SiWireshark,
  "Nmap": Search,
  "Nikto": Shield,
  "SQLMap": Database,
  "SpiderFoot": Globe,
  "Kismet": Radio,
  "Aircrack-ng": Wifi,
}

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

function AnimatedNumber({ value, suffix = "", revealed }: { value: number; suffix?: string; revealed: boolean }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!revealed) return
    const start = performance.now()
    const dur = 2000
    const raf = (now: number) => {
      const p = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.floor(eased * value))
      if (p < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [revealed, value])
  return <>{count}{suffix}</>
}

function StatBox({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const { ref, revealed } = useReveal()
  return (
    <div
      ref={ref}
      className="group relative text-center p-8 bg-gradient-to-b from-foreground/[0.02] to-transparent border border-foreground/[0.04] hover:border-gold/20 transition-all duration-500 overflow-hidden"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className={`font-mono text-3xl md:text-4xl lg:text-5xl font-light text-gold transition-all duration-1000 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <AnimatedNumber value={value} suffix={suffix} revealed={revealed} />
      </div>
      <div className={`text-[10px] text-foreground/30 mt-3 tracking-[0.2em] uppercase font-mono transition-all duration-700 delay-200 ${revealed ? 'opacity-100' : 'opacity-0'}`}>
        {label}
      </div>
    </div>
  )
}

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: -y * 6, y: x * 6 })
  }
  const onLeave = () => setTilt({ x: 0, y: 0 })

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s ease-out",
      }}
    >
      {children}
    </div>
  )
}

export function AboutPage() {
  const { ref: manifestoRef, revealed: manifestoRevealed } = useReveal()
  const { t, tData } = useLang()
  const pList = (tData("about.principlesList") as { title: string; desc: string }[]) || []
  const skillCats = (tData("about.skillCategories") as { name: string; tools: { name: string; note: string }[] }[]) || []
  const statLabels = tData("stats") as string[] || []
  const statsData = [
    { value: 4, suffix: "+" },
    { value: 12, suffix: "+" },
    { value: 24, suffix: "+" },
    { value: 98, suffix: "%" },
  ]

  return (
    <div className="pt-20 md:pt-24 bg-background relative min-h-screen lg:pr-20">
      <span className="section-number hidden md:block">01</span>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 relative z-10">
        <div className="mb-16 md:mb-24">
          <div className="flex items-center gap-4 mb-6">
            <span className="section-marker">// {t("about.heading")}</span>
            <span className="w-12 h-px bg-gradient-to-r from-gold/40 to-transparent" />
          </div>
          <div className="relative">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground leading-[1.05] tracking-tight">
              {t("about.title")}
            </h1>
            <div className="mt-4 w-24 h-[2px] bg-gradient-to-r from-gold/60 to-transparent" />
          </div>
        </div>

        <section aria-label="Introduction" className="grid md:grid-cols-5 gap-10 md:gap-16 mb-24">
          <div className="md:col-span-3 space-y-8">
            <div className="relative pl-6 md:pl-8">
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-gold/40 via-gold/10 to-transparent" />
              <p className="text-base sm:text-lg text-foreground/60 leading-[1.8] tracking-wide">
                {t("about.longDescription")}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {[
                { icon: MapPin, label: personalInfo.location },
                { icon: Mail, label: personalInfo.email },
                { icon: Calendar, label: t("about.established") },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="group flex items-center gap-2.5 text-[11px] text-foreground/40 bg-foreground/[0.02] px-4 py-2.5 border border-foreground/[0.04] hover:border-gold/25 hover:text-gold/60 hover:bg-gold/[0.03] transition-all duration-300"
                >
                  <span className="w-5 h-5 flex items-center justify-center">
                    <Icon size={11} className="text-gold/30 group-hover:text-gold transition-colors duration-300" />
                  </span>
                  <span className="tracking-wide">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <div
              ref={manifestoRef}
              className={`relative h-full border border-border/10 bg-gradient-to-br from-foreground/[0.03] to-transparent p-8 transition-all duration-1000 ${manifestoRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <span className="absolute top-3 left-3 w-6 h-6 border-t border-l border-gold/25" />
              <span className="absolute top-3 right-3 w-6 h-6 border-t border-r border-gold/25" />
              <span className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-gold/25" />
              <span className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-gold/25" />

              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent shimmer-gold" />

              <Quote size={18} className="text-gold/20 mb-5" />

              <p className="text-[10px] text-foreground/30 font-mono tracking-[0.25em] uppercase mb-4">{t("about.manifesto")}</p>

              <p className="text-foreground/70 text-sm leading-[1.9] italic relative z-10">
                {t("about.manifestoText")}
              </p>

              <div className="mt-8 pt-5 border-t border-foreground/[0.04]">
                <p className="font-mono text-[10px] text-gold/50 tracking-[0.3em] uppercase">
                  {personalInfo.name}
                </p>
                <p className="font-mono text-[8px] text-foreground/20 tracking-[0.2em] mt-1 uppercase">
                  {t("hero.subtitle")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Statistics" className="mb-24 contain-content">
          <div className="flex items-center gap-4 mb-10">
            <span className="section-marker">// {t("about.stats")}</span>
            <span className="w-8 h-px bg-foreground/10" />
            <span className="font-mono text-[8px] text-foreground/15">{statsData.length} Metrics</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-foreground/[0.04]">
            {statsData.map((stat, i) => (
              <StatBox key={i} {...stat} label={statLabels[i] || ""} delay={i * 120} />
            ))}
          </div>
        </section>

        <section aria-label="Principles" className="mb-24 contain-content">
          <div className="flex items-center gap-4 mb-10">
            <span className="section-marker">// {t("about.principles")}</span>
            <span className="w-8 h-px bg-foreground/10" />
            <span className="font-mono text-[8px] text-foreground/15">{principles.length} Foundations</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
            {principles.map((p, i) => {
              const item = pList[i] || { title: "", desc: "" }
              const { ref, revealed } = useReveal(0.1)
              const Icon = principleIcons[i]

              return (
                <div
                  key={p.marker}
                  ref={ref}
                  className={`transition-all duration-800 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  <TiltCard className="group relative h-full border border-foreground/[0.04] bg-gradient-to-b from-foreground/[0.01] to-transparent hover:border-gold/20 hover:bg-gold/[0.01] transition-all duration-500 overflow-hidden glow-gold-hover">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

                    <div className="absolute -right-4 -top-4 text-[80px] font-bold text-foreground/[0.02] select-none pointer-events-none leading-none font-mono">
                      {p.marker}
                    </div>

                    <div className="p-6 md:p-8 relative z-10">
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-gold/[0.08] to-gold/[0.02] border border-gold/10 group-hover:border-gold/30 group-hover:from-gold/[0.12] group-hover:to-gold/[0.04] transition-all duration-500">
                          <Icon size={18} className="text-gold/40 group-hover:text-gold transition-colors duration-500" />
                        </div>
                        <span className="font-mono text-[10px] text-gold/30 tracking-widest">{p.marker}</span>
                      </div>

                      <h3 className="text-foreground font-semibold text-lg mb-3 group-hover:text-gold/90 transition-colors duration-500 tracking-tight">
                        {item.title}
                      </h3>

                      <p className="text-foreground/40 text-sm leading-[1.8]">
                        {item.desc}
                      </p>
                    </div>

                    <ArrowUpRight size={14} className="absolute bottom-5 right-5 text-gold/0 group-hover:text-gold/30 transition-all duration-500 -rotate-45 group-hover:rotate-0" />
                  </TiltCard>
                </div>
              )
            })}
          </div>
        </section>

        <section aria-label="Skills" className="contain-content">
          <div className="flex items-center gap-4 mb-10">
            <span className="section-marker">// {t("about.skill")}</span>
            <span className="w-8 h-px bg-foreground/10" />
            <span className="font-mono text-[8px] text-foreground/15">{skillCats.length} Categories</span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {skillCats.map((cat, ci) => {
              const { ref, revealed } = useReveal(0.1)
              const catTools = skills.slice(ci * 8, ci * 8 + 8)
              return (
                <div
                  key={cat.name}
                  ref={ref}
                  className={`transition-all duration-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${ci * 150}ms` }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-gold/[0.08] to-gold/[0.02] border border-gold/10">
                      <span className="font-mono text-[11px] text-gold/60 font-bold">0{ci + 1}</span>
                    </div>
                    <h3 className="text-base font-semibold text-foreground/80 tracking-tight">{cat.name}</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-foreground/[0.06] to-transparent" />
                    <span className="font-mono text-[8px] text-foreground/20 tracking-wider">{cat.tools.length} Tools</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {catTools.map((tool, ti) => {
                      const t = cat.tools[ti] || { name: "", note: "" }
                      const Icon = toolIconMap[t.name]
                      return (
                        <div
                          key={ti}
                          className="group relative border border-foreground/[0.04] bg-gradient-to-b from-foreground/[0.01] to-transparent p-3.5 hover:border-gold/20 hover:bg-gold/[0.01] transition-all duration-300"
                        >
                          <div className="absolute top-0 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div className="flex items-center gap-2.5 mb-2.5">
                            {Icon && (
                              <div className="w-7 h-7 flex items-center justify-center text-foreground/30 group-hover:text-gold/60 transition-colors duration-300 shrink-0">
                                <Icon size={16} />
                              </div>
                            )}
                            <span className="text-xs text-foreground/70 font-medium group-hover:text-gold/80 transition-colors duration-300 truncate tracking-wide">
                              {t.name}
                            </span>
                            <span className="font-mono text-[9px] text-gold/40 font-medium ml-auto tabular-nums">{tool.level}%</span>
                          </div>

                          <div className="h-[2px] bg-foreground/[0.06] rounded-full overflow-hidden mb-1.5">
                            <div
                              className="h-full bg-gradient-to-r from-gold via-gold/60 to-gold/30 rounded-full transition-all duration-1000 ease-out"
                              style={{
                                width: revealed ? `${tool.level}%` : '0%',
                                transitionDelay: `${ci * 150 + ti * 60}ms`,
                              }}
                            />
                          </div>

                          <span className="font-mono text-[8px] text-foreground/20 tracking-wider block leading-relaxed">
                            {t.note}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-16 h-px bg-gradient-to-r from-gold/20 via-foreground/[0.04] to-transparent relative">
            <div className="absolute top-0 left-1/3 right-1/3 h-[1px] bg-gradient-to-r from-transparent via-gold/10 to-transparent shimmer-gold" />
          </div>
        </section>
      </div>
    </div>
  )
}
