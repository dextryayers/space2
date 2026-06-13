import { useState, useRef, useEffect } from "react"
import { ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react"
import { projects } from "@/data/portfolio"
import { useLang } from "@/contexts/LanguageContext"

function TiltCard({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      setTilt({ x: -y * 8, y: x * 8 })
    }
    const onLeave = () => setTilt({ x: 0, y: 0 })
    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", onLeave)
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave) }
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      onClick={onClick}
      style={{ transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: "transform 0.1s ease-out" }}
    >
      {children}
    </div>
  )
}

const projects_ = projects

export function ProjectsPage() {
  const [selected, setSelected] = useState<(typeof projects_)[0] | null>(null)
  const [imgIdx, setImgIdx] = useState(0)
  const { t, tData } = useLang()
  const projectItems = (tData("projects.items") as {
    title: string; subtitle: string; description: string;
    client: string; area: string; specs: string;
  }[]) || []

  const open = (p: (typeof projects_)[0]) => { setSelected(p); setImgIdx(0) }
  const next = () => selected && setImgIdx((i) => (i + 1) % selected.images.length)
  const prev = () => selected && setImgIdx((i) => (i - 1 + selected.images.length) % selected.images.length)

  return (
    <div className="pt-20 md:pt-24 bg-background relative min-h-screen lg:pr-20">
      <span className="section-number hidden md:block">02</span>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="section-marker">// {t("projects.heading")}</span>
            <span className="w-12 h-px bg-gold/30" />
            <span className="font-mono text-[10px] text-foreground/15">02</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight">
            {t("projects.title")}
          </h1>
        </div>

        <section aria-label="Projects grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/[0.03]">
          {projects_.map((p) => {
            const item = projectItems[p.transIdx] || { title: p.tags[0] || "", subtitle: "", description: "", client: "", area: "", specs: "" }
            return (
              <TiltCard key={p.id} className="group relative bg-background overflow-hidden text-left cursor-pointer" onClick={() => open(p)}>
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={p.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ebony via-ebony/20 to-transparent opacity-80" />
                  <div className="absolute inset-0 bg-background/60 group-hover:bg-background/30 transition-colors duration-500" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <span className="absolute top-4 left-4 w-6 h-6 border-t border-l border-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="absolute top-4 right-4 w-6 h-6 border-t border-r border-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-[10px] text-gold/60">{p.year}</span>
                    <span className="w-4 h-px bg-foreground/20" />
                    <span className="text-[10px] text-foreground/30 tracking-wider">{item.area}</span>
                  </div>
                  <h3 className="text-foreground text-xl sm:text-2xl font-bold group-hover:text-gold transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-foreground/40 text-xs uppercase tracking-wider mt-1">{item.subtitle}</p>
                </div>
              </TiltCard>
            )
          })}
        </section>

        {selected && (() => {
          const item = projectItems[selected.transIdx] || { title: "", subtitle: "", description: "", client: "", area: "", specs: "" }
          return (
            <div
              className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-scale-in"
              onClick={() => setSelected(null)}
              role="dialog" aria-modal="true" aria-label={item.title}
            >
              <div
                className="relative w-full max-w-5xl bg-card border border-border/[0.06] max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors bg-background/80 hover:bg-gold/20"
                  aria-label="Close project details"
                >
                  <X size={18} />
                </button>

                <div className="grid md:grid-cols-5">
                  <div className="md:col-span-3 relative bg-background flex items-center justify-center p-4">
                    <img
                      src={selected.images[imgIdx]}
                      alt={item.title}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                    {selected.images.length > 1 && (
                      <>
                        <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-background/80 flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-gold/20 transition-all" aria-label="Previous image">
                          <ChevronLeft size={18} />
                        </button>
                        <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-background/80 flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-gold/20 transition-all" aria-label="Next image">
                          <ChevronRight size={18} />
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {selected.images.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setImgIdx(i)}
                              className={`w-1.5 h-1.5 transition-all ${i === imgIdx ? "bg-gold w-4" : "bg-foreground/30 hover:bg-foreground/50"}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="md:col-span-2 p-6 md:p-8 flex flex-col">
                    <div className="space-y-1 mb-6">
                      <span className="font-mono text-[10px] text-gold/60">{selected.year}</span>
                      <h2 className="text-xl md:text-2xl font-bold text-foreground">{item.title}</h2>
                      <p className="text-xs text-foreground/40 tracking-wider">{item.subtitle}</p>
                    </div>

                    <div className="space-y-3 mb-6">
                      {[
                        { label: t("projects.client"), value: item.client },
                        { label: t("projects.scope"), value: item.area },
                        { label: t("projects.specs"), value: item.specs },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex items-center gap-3">
                          <span className="font-mono text-[9px] tracking-wider text-foreground/20 uppercase w-16 shrink-0">{label}</span>
                          <span className="w-4 h-px bg-foreground/[0.06]" />
                          <span className="text-xs text-foreground/60">{value}</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-sm text-foreground/50 leading-relaxed mb-6">{item.description}</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {selected.tags.map((t) => (
                        <span key={t} className="font-mono text-[10px] text-foreground/30 border border-border/[0.06] px-3 py-1 hover:border-gold/30 hover:text-gold/60 transition-all duration-300">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-auto">
                      <a href={selected.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-xs tracking-wider uppercase py-3 border border-border/10 text-foreground/50 hover:text-foreground hover:border-border/30 transition-all duration-300">
                        {t("projects.source")}
                      </a>
                      <a href={selected.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-xs tracking-wider uppercase py-3 bg-gold text-ebony hover:bg-gold-light transition-all duration-300 flex items-center justify-center gap-2">
                        <ExternalLink size={12} />
                        {t("projects.liveDemo")}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
