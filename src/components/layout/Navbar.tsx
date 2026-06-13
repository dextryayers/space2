import { useLocation, useNavigate } from "react-router-dom"
import { Menu, X, Home, User, Images, Code2, Briefcase, Mail, Award, Sun, Moon } from "lucide-react"
import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { useLang } from "@/contexts/LanguageContext"

const pages = [
  { path: "/", labelKey: "index", Icon: Home },
  { path: "/about", labelKey: "profile", Icon: User },
  { path: "/gallery", labelKey: "gallery", Icon: Images },
  { path: "/projects", labelKey: "works", Icon: Code2 },
  { path: "/experience", labelKey: "archive", Icon: Briefcase },
  { path: "/certificates", labelKey: "creds", Icon: Award },
  { path: "/contact", labelKey: "contact", Icon: Mail },
]

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const { theme, toggle: toggleTheme } = useTheme()
  const { lang, setLang, t } = useLang()
  const currentPath = location.pathname === "/" ? "/" : location.pathname

  const isActive = (path: string) => currentPath === path
  const toggleLang = () => setLang(lang === "en" ? "id" : "en")

  const labelStyle = (active: boolean) =>
    `text-xs tracking-[0.2em] uppercase transition-colors ${
      active ? "text-gold" : "text-foreground/50 group-hover:text-foreground"
    }`

  return (
    <>
      {/* ==================== DESKTOP: RIGHT SIDE NAV ==================== */}
      <nav className="hidden lg:flex fixed right-0 top-0 bottom-0 z-50 w-20 flex-col items-center justify-center bg-background/90 backdrop-blur-xl border-l border-foreground/[0.03]" aria-label="Main navigation">
        {/* Top logo indicator */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2">
          <div className="w-px h-6 bg-gold/30 mx-auto mb-2" />
          <button onClick={() => navigate("/")} className="block text-center" aria-label="Go to home">
            <span className="font-mono text-[8px] tracking-[0.3em] text-foreground/20 uppercase block -rotate-90 origin-center translate-y-4">
              {t("nav.studio")}
            </span>
          </button>
        </div>

        {/* Nav items */}
        <div className="flex flex-col items-center gap-5" role="list">
          {pages.map(({ path, labelKey, Icon }) => {
            const active = isActive(path)
            return (
              <div key={path} className="relative flex items-center" role="listitem">
                {/* Label tooltip (appears to the left on hover) */}
                <div
                  className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-gold text-ebony text-[10px] tracking-[0.15em] uppercase font-medium whitespace-nowrap transition-all duration-300 ${
                    hovered === path || active
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-2 pointer-events-none"
                  }`}
                >
                  {t(`nav.${labelKey}`)}
                  <span className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-gold rotate-45" />
                </div>

                {/* Circle button */}
                <button
                  onClick={() => navigate(path)}
                  onMouseEnter={() => setHovered(path)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(path)}
                  onBlur={() => setHovered(null)}
                  className={`relative w-12 h-12 flex items-center justify-center transition-all duration-300 ${
                    active
                      ? "bg-gold text-ebony shadow-lg shadow-gold/20"
                      : "bg-foreground/[0.04] text-foreground/40 hover:bg-foreground/[0.08] hover:text-foreground/70 border border-foreground/[0.06]"
                  }`}
                  aria-label={t(`nav.${labelKey}`)}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon size={18} />
                  {active && (
                    <span className="absolute -left-[3px] top-1/2 -translate-y-1/2 w-[3px] h-6 bg-gold" />
                  )}
                </button>
              </div>
            )
          })}

          {/* Divider */}
          <div className="w-6 h-px bg-foreground/[0.06] my-1" />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-12 h-12 flex items-center justify-center bg-foreground/[0.04] text-foreground/40 hover:bg-foreground/[0.08] hover:text-foreground/70 border border-foreground/[0.06] transition-all duration-300"
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="w-12 h-12 flex items-center justify-center bg-foreground/[0.04] text-foreground/40 hover:bg-foreground/[0.08] hover:text-foreground/70 border border-foreground/[0.06] transition-all duration-300 font-mono text-[11px] tracking-wider"
            title={lang === "en" ? "Switch to Indonesian" : "Switch to English"}
          >
            {lang === "en" ? "EN" : "ID"}
          </button>
        </div>

        {/* Bottom indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-px h-6 bg-gradient-to-b from-transparent to-gold/20 mx-auto mb-2" />
          <span className="font-mono text-[8px] tracking-[0.3em] text-foreground/10 block -rotate-90 origin-center -translate-y-4">
            {currentPath === "/" ? "00" : String(pages.findIndex(p => p.path === currentPath)).padStart(2, '0')}
          </span>
        </div>
      </nav>

      {/* ==================== MOBILE: TOP BAR ==================== */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 px-5 h-16 flex items-center justify-between bg-background/90 backdrop-blur-xl border-b border-foreground/[0.03]">
        <button onClick={() => navigate("/")} className="text-sm font-light tracking-[0.2em] text-foreground/80" aria-label="Go to home">
          {t("nav.portfolio")}
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="text-foreground/40 hover:text-foreground/70 transition-colors"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={toggleLang}
            className="font-mono text-[11px] tracking-wider text-foreground/40 hover:text-foreground/70 transition-colors"
            aria-label={lang === "en" ? "Switch to Indonesian" : "Switch to English"}
          >
            {lang === "en" ? "EN" : "ID"}
          </button>
          <button onClick={() => setOpen(!open)} className="text-foreground/60 hover:text-foreground transition-colors" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background flex flex-col items-center justify-center gap-8" role="dialog" aria-modal="true" aria-label="Navigation menu">
          {pages.map(({ path, labelKey, Icon }) => {
            const active = isActive(path)
            return (
              <button
                key={path}
                onClick={() => { navigate(path); setOpen(false) }}
                className="flex items-center gap-4 group"
                aria-label={t(`nav.${labelKey}`)}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={20} className={active ? "text-gold" : "text-foreground/30 group-hover:text-foreground/60"} />
                <span className={labelStyle(active)}>
                  {t(`nav.${labelKey}`)}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}
