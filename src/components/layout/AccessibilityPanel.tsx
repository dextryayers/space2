import { useState } from "react"
import {
  Accessibility, Eye, MousePointer2, Wind,
  Minus, Plus, RotateCcw, ZoomIn, ZoomOut, ChevronRight, ChevronLeft, Check,
} from "lucide-react"
import { useA11y, fonts } from "@/contexts/AccessibilityContext"

const features = [
  { key: "reducedMotion", icon: Wind, label: "Reduced Motion" },
  { key: "highContrast", icon: Eye, label: "High Contrast" },
  { key: "focusOutline", icon: MousePointer2, label: "Focus Outline" },
] as const

export function AccessibilityPanel() {
  const [open, setOpen] = useState(false)
  const a11y = useA11y()

  return (
    <>
      {/* Toggle button - always visible on left edge */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50 w-5 h-12 flex items-center justify-center bg-gold text-ebony hover:bg-gold-light transition-all duration-300 rounded-r-sm shadow-lg"
        aria-label={open ? "Hide accessibility panel" : "Show accessibility panel"}
        aria-expanded={open}
      >
        {open ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>

      {/* Panel */}
      <div
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-40 w-72 bg-card border border-border/10 border-l-0 shadow-2xl transition-all duration-400 py-6 px-5 ${
          open ? "translate-x-6 opacity-100 pointer-events-auto" : "-translate-x-full opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-label="Accessibility settings"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border/[0.06]">
          <Accessibility size={16} className="text-gold" />
          <h2 className="font-mono text-[9px] tracking-[0.2em] text-gold/60 uppercase flex-1">
            Accessibility
          </h2>
        </div>

        <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
          {/* ===== ZOOM ===== */}
          <Section label="Zoom">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-foreground/40 w-12">{a11y.settings.zoom}%</span>
              <button onClick={a11y.zoomOut} className="w-8 h-8 flex items-center justify-center bg-foreground/[0.06] text-foreground/50 hover:text-foreground hover:bg-foreground/[0.1] transition-all" aria-label="Zoom out">
                <ZoomOut size={14} />
              </button>
              <button onClick={a11y.resetZoom} className="w-8 h-8 flex items-center justify-center bg-foreground/[0.06] text-foreground/50 hover:text-foreground hover:bg-foreground/[0.1] transition-all" aria-label="Reset zoom">
                <RotateCcw size={12} />
              </button>
              <button onClick={a11y.zoomIn} className="w-8 h-8 flex items-center justify-center bg-foreground/[0.06] text-foreground/50 hover:text-foreground hover:bg-foreground/[0.1] transition-all" aria-label="Zoom in">
                <ZoomIn size={14} />
              </button>
            </div>
          </Section>

          {/* ===== FONT SIZE ===== */}
          <Section label="Font Size">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-foreground/40 w-12">{a11y.settings.fontSize}%</span>
              <button onClick={a11y.decreaseFont} className="w-8 h-8 flex items-center justify-center bg-foreground/[0.06] text-foreground/50 hover:text-foreground hover:bg-foreground/[0.1] transition-all" aria-label="Decrease font size">
                <Minus size={14} />
              </button>
              <button onClick={a11y.resetFont} className="w-8 h-8 flex items-center justify-center bg-foreground/[0.06] text-foreground/50 hover:text-foreground hover:bg-foreground/[0.1] transition-all" aria-label="Reset font size">
                <RotateCcw size={12} />
              </button>
              <button onClick={a11y.increaseFont} className="w-8 h-8 flex items-center justify-center bg-foreground/[0.06] text-foreground/50 hover:text-foreground hover:bg-foreground/[0.1] transition-all" aria-label="Increase font size">
                <Plus size={14} />
              </button>
            </div>
          </Section>

          {/* ===== FONT FAMILY ===== */}
          <Section label="Font Family">
            <div className="grid grid-cols-1 gap-1">
              {fonts.map(f => {
                const active = a11y.settings.fontFamily === f.value
                return (
                  <button
                    key={f.value}
                    onClick={() => a11y.setFontFamily(f.value)}
                    className={`flex items-center gap-3 px-3 py-2 text-left transition-all ${
                      active ? "bg-gold/10 text-gold" : "text-foreground/50 hover:text-foreground hover:bg-foreground/[0.04]"
                    }`}
                    style={{ fontFamily: f.value }}
                    aria-label={`Switch to ${f.name} font`}
                  >
                    <span className={`w-3 h-3 flex items-center justify-center ${active ? "text-gold" : "text-transparent"}`}>
                      {active && <Check size={12} />}
                    </span>
                    <span className="text-xs">{f.name}</span>
                    <span className="font-mono text-[8px] text-foreground/20 ml-auto">{f.category}</span>
                  </button>
                )
              })}
            </div>
          </Section>

          {/* ===== TOGGLES ===== */}
          <Section label="Toggles">
            <div className="space-y-1">
              {features.map(({ key, icon: Icon, label }) => {
                const checked = a11y.settings[key as keyof typeof a11y.settings] as boolean
                return (
                  <ToggleItem
                    key={key}
                    icon={<Icon size={12} />}
                    label={label}
                    checked={checked}
                    onToggle={() => {
                      if (key === "reducedMotion") a11y.toggleReducedMotion()
                      else if (key === "highContrast") a11y.toggleHighContrast()
                      else if (key === "focusOutline") a11y.toggleFocusOutline()
                    }}
                  />
                )
              })}
            </div>
          </Section>
        </div>

        <p className="mt-4 pt-3 border-t border-border/[0.06] font-mono text-[7px] text-foreground/10 tracking-wider text-center">
          Preferences saved locally
        </p>
      </div>
    </>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="block font-mono text-[8px] tracking-[0.2em] text-foreground/20 uppercase mb-2">
        {label}
      </span>
      {children}
    </div>
  )
}

function ToggleItem({
  icon, label, checked, onToggle,
}: {
  icon: React.ReactNode
  label: string
  checked: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-2 px-3 bg-foreground/[0.03] hover:bg-foreground/[0.06] transition-all group rounded-sm"
      role="switch"
      aria-checked={checked}
      aria-label={label}
    >
      <span className="flex items-center gap-2 font-mono text-[9px] text-foreground/40 group-hover:text-foreground/60 tracking-wider uppercase transition-colors">
        {icon}
        {label}
      </span>
      <span
        className={`w-8 h-4 flex items-center rounded-full transition-colors duration-300 ${
          checked ? "bg-gold" : "bg-foreground/[0.1]"
        }`}
      >
        <span
          className={`w-3 h-3 bg-ebony rounded-full transition-transform duration-300 ${
            checked ? "translate-x-[18px]" : "translate-x-[2px]"
          }`}
        />
      </span>
    </button>
  )
}
