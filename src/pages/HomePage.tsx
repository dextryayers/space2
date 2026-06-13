import { useEffect, useRef, useState, useCallback, lazy, Suspense } from "react"
import { personalInfo } from "@/data/portfolio"
import { useLang } from "@/contexts/LanguageContext"
import { motion } from "framer-motion"
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa"

const DottedSurfaceLazy = lazy(() =>
  import("@/components/ui/dotted-surface").then(m => ({ default: m.DottedSurface }))
)

const typedTitles = [
  "Fullstack Web Developer",
  "Offensive Security",
  "AI Engineer",
  "Network Engineer",
]

function TypeWriter({ words }: { words: string[] }) {
  const [idx, setIdx] = useState(0)
  const [char, setChar] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[idx]
    if (!word) return
    const speed = deleting ? 40 : 80

    const timer = setTimeout(() => {
      if (!deleting) {
        if (char < word.length) {
          setChar((c) => c + 1)
        } else {
          setTimeout(() => setDeleting(true), 2000)
        }
      } else {
        if (char > 0) {
          setChar((c) => c - 1)
        } else {
          setDeleting(false)
          setIdx((i) => (i + 1) % words.length)
        }
      }
    }, speed)

    return () => clearTimeout(timer)
  }, [char, deleting, idx, words])

  return (
    <span>
      {words[idx]?.slice(0, char) || ""}
      <span className="inline-block w-[2px] h-[1em] bg-gold/70 ml-0.5 animate-pulse-accent align-middle" />
    </span>
  )
}

function DragPhoto() {
  const ref = useRef<HTMLDivElement>(null)
  const [rot, setRot] = useState({ x: 0, y: 0 })
  const [hover, setHover] = useState(false)
  const [dragging, setDragging] = useState(false)
  const last = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const raf = useRef<number>(0)

  const startDrag = useCallback((clientX: number, clientY: number) => {
    setDragging(true)
    last.current = { x: clientX, y: clientY }
  }, [])

  const moveDrag = useCallback((clientX: number, clientY: number) => {
    if (!dragging) return
    const dx = clientX - last.current.x
    const dy = clientY - last.current.y
    last.current = { x: clientX, y: clientY }
    target.current = {
      x: Math.max(-30, Math.min(30, target.current.x - dy * 0.5)),
      y: target.current.y + dx * 0.5,
    }
  }, [dragging])

  const endDrag = useCallback(() => {
    setDragging(false)
    target.current.x = 0
  }, [])

  useEffect(() => {
    const tick = () => {
      const cur = rot
      const tgt = target.current
      const nx = cur.x + (tgt.x - cur.x) * 0.12
      const ny = cur.y + (tgt.y - cur.y) * 0.12
      if (Math.abs(nx - cur.x) > 0.01 || Math.abs(ny - cur.y) > 0.01) {
        setRot({ x: nx, y: ny })
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [rot])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const el = ref.current
    if (!el) return
    el.setPointerCapture(e.pointerId)
    startDrag(e.clientX, e.clientY)
  }, [startDrag])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    moveDrag(e.clientX, e.clientY)
  }, [moveDrag])

  const onPointerUp = useCallback(() => {
    endDrag()
  }, [endDrag])

  const tiltOnHover = useCallback((e: React.MouseEvent) => {
    if (dragging) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    target.current = { x: -py * 20, y: px * 25 }
  }, [dragging])

  const resetOnLeave = useCallback(() => {
    if (!dragging) {
      target.current = { x: 0, y: 0 }
    }
  }, [dragging])

  const rotY = rot.y % 360

  const layer = (z: number, children: React.ReactNode) => (
    <div style={{ transform: `translateZ(${z}px)` }} className="absolute inset-0 pointer-events-none">
      {children}
    </div>
  )

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { resetOnLeave(); setHover(false) }}
      onMouseMove={tiltOnHover}
      className="relative w-full h-full touch-none select-none"
      style={{
        transform: `perspective(1200px) rotateX(${rot.x}deg) rotateY(${rotY}deg)`,
        transition: dragging ? "none" : "transform 0.08s ease-out",
        transformStyle: "preserve-3d",
      }}
      role="img"
      aria-label="Interactive 3D profile photo. Drag to rotate."
    >
      {/* Z = -60: Shadow */}
      <motion.div
        className="absolute -bottom-6 left-[8%] right-[8%] h-6 bg-black/50 blur-3xl rounded-full pointer-events-none"
        style={{ transform: "translateZ(-60px)" }}
        animate={{ scale: hover ? 1.2 : 1, opacity: hover ? 0.6 : 0.3 }}
        transition={{ duration: 0.4 }}
      />

      {/* Z = -30: Aura */}
      <div className="absolute -inset-6 pointer-events-none" style={{ transform: "translateZ(-30px)" }}>
        <motion.div
          className="w-full h-full rounded-[35px] bg-gradient-to-br from-gold/15 via-transparent to-purple-500/5 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Z = 0: Photo */}
      {layer(0,
        <div className="absolute inset-0 overflow-hidden rounded-[25px]">
          <img
            src="/img/main.png"
            alt="Profile portrait of the developer"
            className="w-full h-full object-cover pointer-events-none"
            fetchPriority="high"
            draggable={false}
            style={{ filter: "contrast(1.05) saturate(1.1)" }}
          />
        </div>
      )}

      {/* Z = 5: Overlay */}
      {layer(5,
        <div className="absolute inset-0 rounded-[25px] bg-gradient-to-tr from-gold/20 via-transparent to-transparent mix-blend-overlay" />
      )}

      {/* Z = 8: Vignette */}
      {layer(8,
        <div className="absolute inset-0 rounded-[25px] bg-gradient-to-b from-transparent via-transparent to-black/30" />
      )}

      {/* Z = 10: Inner border */}
      {layer(10,
        <div className="absolute inset-[5px] rounded-[20px] ring-1 ring-gold/15" />
      )}

      {/* Z = 12: Outer frame */}
      {layer(12,
        <div className="absolute inset-0 rounded-[25px] ring-1 ring-gold/30" />
      )}

      {/* Z = 15: Glass shine */}
      {layer(15,
        <motion.div
          className="absolute inset-0 rounded-[25px] bg-gradient-to-br from-white/10 via-transparent to-transparent"
          animate={{ opacity: hover ? 0.8 : 0.3 }}
          transition={{ duration: 0.4 }}
        />
      )}

      {/* Z = 18: Top edge */}
      {layer(18,
        <motion.div
          className="absolute top-0 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-gold/60 to-transparent rounded-full"
          animate={{ opacity: hover ? 1 : 0.5 }}
          transition={{ duration: 0.4 }}
        />
      )}

      {/* Z = 22: Scanning shimmer */}
      <div style={{ transform: "translateZ(22px)" }} className="absolute inset-0 pointer-events-none overflow-hidden rounded-[25px]">
        <motion.div
          className="absolute left-0 right-0 h-[40%] bg-gradient-to-b from-gold/8 via-gold/3 to-transparent"
          animate={{ top: ["-40%", "140%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 0.5 }}
        />
      </div>

      {/* Z = 25: Floating particles */}
      <motion.div
        className="absolute -top-4 -right-2 w-3 h-3 bg-gold/50 rounded-full blur-[1px] pointer-events-none"
        style={{ transform: "translateZ(25px)" }}
        animate={{
          y: [0, -10, 0], x: [0, 4, 0], opacity: [0.3, 0.9, 0.3], scale: [1, 1.3, 1],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-3 -left-3 w-2 h-2 bg-gold/40 rounded-full blur-[1px] pointer-events-none"
        style={{ transform: "translateZ(25px)" }}
        animate={{
          y: [0, 8, 0], x: [0, -3, 0], opacity: [0.2, 0.7, 0.2], scale: [1, 1.4, 1],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-1/4 -right-5 w-1.5 h-1.5 bg-gold/30 rounded-full pointer-events-none"
        style={{ transform: "translateZ(25px)" }}
        animate={{
          y: [0, -12, 0], opacity: [0, 0.6, 0], scale: [0.5, 1.5, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  )
}

export function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { t, tData } = useLang()
  const quotes = tData("quotes") as { text: string; figure: string }[]

  const showQuote = async () => {
    const Swal = (await import("sweetalert2")).default
    const q = quotes[Math.floor(Math.random() * quotes.length)]
    Swal.fire({
      title: q.figure,
      text: q.text,
      icon: "info",
      background: "var(--color-card)",
      color: "var(--color-foreground)",
      confirmButtonColor: "var(--color-gold)",
      confirmButtonText: "OK",
      timer: 6000,
      timerProgressBar: true,
      showClass: { popup: "animate-scale-in" },
      hideClass: { popup: "animate-scale-out" },
    })
  }

  useEffect(() => {
    const onScroll = () => {
      const s = window.pageYOffset
      if (heroRef.current) heroRef.current.style.transform = `translateY(${s * -0.04}px)`
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="lg:pr-20">
      <section className="relative min-h-screen flex items-center bg-background overflow-hidden pt-20 md:pt-24">
        <Suspense fallback={null}><DottedSurfaceLazy /></Suspense>

        <div className="absolute left-[15%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-foreground/[0.03] to-transparent" />
        <div className="absolute left-[85%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-foreground/[0.03] to-transparent" />

        <div className="absolute top-[20%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.02] to-transparent" />
        <div className="absolute bottom-[20%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.02] to-transparent" />

        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[clamp(200px,30vw,500px)] font-bold text-foreground/[0.015] select-none pointer-events-none leading-none pr-8 font-[family-name:var(--font-mono)]">
          _
        </div>

        <div ref={heroRef} className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-5 flex justify-center md:justify-start">
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="relative w-52 sm:w-64 lg:w-80 aspect-[3/4]">
                  {/* Animated orbiting rings */}
                  <motion.div
                    className="absolute -inset-6 rounded-[31px] border border-gold/10"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute -inset-10 rounded-[35px] border border-gold/5 border-dashed"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Glow behind */}
                  <motion.div
                    className="absolute -inset-10 bg-gradient-to-br from-gold/20 via-amber-500/10 to-transparent blur-3xl"
                    animate={{
                      scale: [1, 1.12, 1],
                      opacity: [0.3, 0.6, 0.3],
                      rotate: [0, 5, 0],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* Floating container */}
                  <motion.div
                    className="relative w-full h-full"
                    animate={{
                      y: [0, -10, 0],
                      rotateX: [0, 2, 0],
                    }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <DragPhoto />
                  </motion.div>

                  {/* Decorative corner marks */}
                  <span className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-gold/40" />
                  <span className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-gold/40" />
                  <span className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-gold/40" />
                  <span className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-gold/40" />
                </div>
              </motion.div>
            </div>

            <div className="md:col-span-7 space-y-6 md:space-y-8">
              <div className="space-y-1 animate-fade-slide-up">
                <p className="font-mono text-[10px] tracking-[0.3em] text-gold/60 uppercase">
                  {t("hero.subtitle")}
                </p>
                <div className="w-12 h-px bg-gold/40 animate-draw-in" />
              </div>

              <div className="animate-fade-slide-up delay-2">
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[0.95] whitespace-nowrap">
                  {personalInfo.name.split(" ")[0]}{" "}
                  <span className="text-gold">{personalInfo.name.split(" ")[1]}</span>
                </h1>
              </div>

              <div className="h-7 sm:h-8 animate-fade-slide-up delay-3">
                <p className="font-mono text-xs sm:text-sm md:text-base text-gold/70 tracking-wider font-semibold">
                  <TypeWriter words={typedTitles} />
                  <span className="inline-block mx-3 w-px h-3 sm:h-4 bg-gold/20 align-middle" />
                  <span className="text-[9px] sm:text-[10px] md:text-xs text-foreground/30 tracking-[0.25em] align-middle">
                    <span className="inline-block w-1.5 h-1.5 bg-gold/40 rounded-sm mr-1.5 align-middle" />
                    {t("hero.fromIndonesia")}
                  </span>
                </p>
              </div>

              <p className="text-sm sm:text-base md:text-lg text-foreground/50 leading-relaxed max-w-xl animate-fade-slide-up delay-4">
                {t("hero.tagline")}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-slide-up delay-4">
                <button
                  onClick={showQuote}
                  className="group relative w-full sm:w-auto px-8 py-3.5 bg-gold text-ebony text-sm font-medium tracking-wider uppercase hover:bg-gold-light transition-all duration-300 overflow-hidden"
                  aria-label="Get a motivational quote"
                >
                  <span className="relative z-10">{t("hero.getQuote")}</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-gold-light to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
                <a
                  href={personalInfo.resumeUrl}
                  download
                  className="w-full sm:w-auto px-8 py-3.5 border border-gold/20 text-gold/70 text-sm tracking-wider uppercase hover:bg-gold/10 hover:text-gold transition-all duration-300 text-center"
                  aria-label="Download CV"
                >
                  {t("hero.downloadCv")}
                </a>
              </div>

              <div className="flex items-center gap-5 pt-4 animate-fade-slide-up delay-5">
                <a href={`mailto:${personalInfo.socials.email}`} className="text-foreground/20 hover:text-gold/70 transition-colors duration-300" aria-label="Email me">
                  <FaEnvelope size={18} />
                </a>
                <a href={personalInfo.socials.github} target="_blank" rel="noopener noreferrer" className="text-foreground/20 hover:text-gold/70 transition-colors duration-300" aria-label="GitHub profile">
                  <FaGithub size={20} />
                </a>
                <a href={personalInfo.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-foreground/20 hover:text-gold/70 transition-colors duration-300" aria-label="LinkedIn profile">
                  <FaLinkedin size={20} />
                </a>
                <a href={personalInfo.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-foreground/20 hover:text-gold/70 transition-colors duration-300" aria-label="Instagram profile">
                  <FaInstagram size={20} />
                </a>
                <a href={personalInfo.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="text-foreground/20 hover:text-gold/70 transition-colors duration-300" aria-label="WhatsApp">
                  <FaWhatsapp size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="font-mono text-[8px] tracking-[0.3em] text-foreground/20 uppercase">{t("hero.scroll")}</span>
          <div className="w-px h-8 bg-gradient-to-b from-foreground/20 to-transparent" />
          <div className="w-3 h-3 border border-border/10 rotate-45 animate-bounce" />
        </div>
      </section>
    </div>
  )
}
