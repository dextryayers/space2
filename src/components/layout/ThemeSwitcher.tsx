import { useState } from "react"
import { Palette, X, Sun, Moon } from "lucide-react"
import { useTheme, colorThemes } from "@/contexts/ThemeContext"
import { useLang } from "@/contexts/LanguageContext"

export function ThemeSwitcher() {
  const [open, setOpen] = useState(false)
  const { theme, toggle: toggleTheme, accent, setAccent } = useTheme()
  const { lang, setLang } = useLang()

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed left-4 bottom-4 z-[60] w-10 h-10 flex items-center justify-center bg-background/80 backdrop-blur-xl border border-foreground/[0.06] text-foreground/40 hover:text-foreground hover:border-foreground/[0.12] shadow-lg transition-all duration-300"
        aria-label={open ? "Close theme settings" : "Open theme settings"}
        aria-expanded={open}
      >
        {open ? <X size={16} /> : <Palette size={16} />}
      </button>

      {/* Panel */}
      <div
        className={`fixed left-4 bottom-16 z-[60] w-64 bg-background/95 backdrop-blur-xl border border-foreground/[0.06] shadow-2xl transition-all duration-400 ${
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="p-5 space-y-5">
          {/* Mode switch */}
          <div>
            <p className="font-mono text-[9px] tracking-[0.2em] text-foreground/20 mb-3 uppercase">Mode</p>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-4 py-3 bg-foreground/[0.03] hover:bg-foreground/[0.06] transition-all duration-300"
            >
              <span className="text-xs text-foreground/60 uppercase tracking-wider">
                {theme === "dark" ? "Dark" : "Light"} Mode
              </span>
              <span className="text-foreground/40">
                {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
              </span>
            </button>
          </div>

          {/* Language switch */}
          <div>
            <p className="font-mono text-[9px] tracking-[0.2em] text-foreground/20 mb-3 uppercase">Language</p>
            <div className="flex gap-1">
              {(["en", "id"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`flex-1 py-3 text-xs tracking-wider uppercase font-mono transition-all duration-300 ${
                    lang === l
                      ? "bg-gold text-ebony"
                      : "bg-foreground/[0.03] text-foreground/30 hover:bg-foreground/[0.06] hover:text-foreground/60"
                  }`}
                >
                  {l === "en" ? "EN" : "ID"}
                </button>
              ))}
            </div>
          </div>

          {/* Color themes */}
          <div>
            <p className="font-mono text-[9px] tracking-[0.2em] text-foreground/20 mb-3 uppercase">Accent Color</p>
            <div className="grid grid-cols-5 gap-2">
              {colorThemes.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setAccent(c)}
                  className={`relative w-full aspect-square flex items-center justify-center transition-all duration-300 ${
                    accent.id === c.id
                      ? "ring-2 ring-offset-2 ring-offset-background scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: c.accent,
                  }}
                  title={c.label}
                >
                  {accent.id === c.id && (
                    <span className="w-1.5 h-1.5 bg-ebony rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
