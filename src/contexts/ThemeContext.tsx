import { createContext, useContext, useEffect, useState } from "react"

export type Theme = "dark" | "light"

export interface ColorTheme {
  id: string
  label: string
  accent: string
  light: string
  dark: string
  rgb: string
}

export const colorThemes: ColorTheme[] = [
  { id: "gold", label: "Gold", accent: "#d4a574", light: "#e8c39e", dark: "#c9955a", rgb: "212,165,116" },
  { id: "purple", label: "Purple", accent: "#a855f7", light: "#c084fc", dark: "#9333ea", rgb: "168,85,247" },
  { id: "blue", label: "Blue", accent: "#3b82f6", light: "#60a5fa", dark: "#2563eb", rgb: "59,130,246" },
  { id: "green", label: "Green", accent: "#22c55e", light: "#4ade80", dark: "#16a34a", rgb: "34,197,94" },
  { id: "red", label: "Red", accent: "#ef4444", light: "#f87171", dark: "#dc2626", rgb: "239,68,68" },
  { id: "pink", label: "Pink", accent: "#ec4899", light: "#f472b6", dark: "#db2777", rgb: "236,72,153" },
  { id: "cyan", label: "Cyan", accent: "#06b6d4", light: "#22d3ee", dark: "#0891b2", rgb: "6,182,212" },
  { id: "orange", label: "Orange", accent: "#f97316", light: "#fb923c", dark: "#ea580c", rgb: "249,115,22" },
  { id: "teal", label: "Teal", accent: "#14b8a6", light: "#2dd4bf", dark: "#0d9488", rgb: "20,184,166" },
  { id: "rose", label: "Rose", accent: "#f43f5e", light: "#fb7185", dark: "#e11d48", rgb: "244,63,94" },
]

const ThemeContext = createContext<{
  theme: Theme
  toggle: () => void
  accent: ColorTheme
  setAccent: (t: ColorTheme) => void
}>({ theme: "dark", toggle: () => {}, accent: colorThemes[0], setAccent: () => {} })

function applyAccent(t: ColorTheme) {
  const root = document.documentElement
  root.style.setProperty("--accent", t.accent)
  root.style.setProperty("--accent-light", t.light)
  root.style.setProperty("--accent-dark", t.dark)
  root.style.setProperty("--accent-rgb", t.rgb)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("portfolio-theme")
    if (stored === "light" || stored === "dark") return stored
    return "dark"
  })

  const [accent, setAccentState] = useState<ColorTheme>(() => {
    const stored = localStorage.getItem("portfolio-accent")
    const found = colorThemes.find((c) => c.id === stored)
    return found || colorThemes[0]
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    root.classList.toggle("light", theme === "light")
  }, [theme])

  useEffect(() => {
    applyAccent(accent)
    localStorage.setItem("portfolio-accent", accent.id)
  }, [accent])

  useEffect(() => {
    localStorage.setItem("portfolio-theme", theme)
    document.body.style.background =
      theme === "dark" ? "#0a0a0a" : "#f5f5f5"
    document.body.style.color =
      theme === "dark" ? "#f5f5f5" : "#0a0a0a"
  }, [theme])

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"))
  const setAccent = (t: ColorTheme) => setAccentState(t)

  return (
    <ThemeContext.Provider value={{ theme, toggle, accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
