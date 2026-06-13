import { createContext, useCallback, useContext, useEffect, useState } from "react"

export const fonts = [
  { name: "Inter", value: "'Inter', sans-serif", category: "Sans-serif" },
  { name: "Poppins", value: "'Poppins', sans-serif", category: "Sans-serif" },
  { name: "Roboto", value: "'Roboto', sans-serif", category: "Sans-serif" },
  { name: "Open Sans", value: "'Open Sans', sans-serif", category: "Sans-serif" },
  { name: "Lora", value: "'Lora', serif", category: "Serif" },
  { name: "Fira Code", value: "'Fira Code', monospace", category: "Monospace" },
  { name: "Playfair Display", value: "'Playfair Display', serif", category: "Serif" },
]

interface A11ySettings {
  reducedMotion: boolean
  fontSize: number
  highContrast: boolean
  focusOutline: boolean
  fontFamily: string
  zoom: number
}

const defaultSettings: A11ySettings = {
  reducedMotion: false,
  fontSize: 100,
  highContrast: false,
  focusOutline: true,
  fontFamily: fonts[0].value,
  zoom: 100,
}

const A11yContext = createContext<{
  settings: A11ySettings
  toggleReducedMotion: () => void
  toggleHighContrast: () => void
  toggleFocusOutline: () => void
  increaseFont: () => void
  decreaseFont: () => void
  resetFont: () => void
  setFontFamily: (f: string) => void
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
}>({
  settings: defaultSettings,
  toggleReducedMotion: () => {},
  toggleHighContrast: () => {},
  toggleFocusOutline: () => {},
  increaseFont: () => {},
  decreaseFont: () => {},
  resetFont: () => {},
  setFontFamily: () => {},
  zoomIn: () => {},
  zoomOut: () => {},
  resetZoom: () => {},
})

export function A11yProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<A11ySettings>(() => {
    const stored = localStorage.getItem("portfolio-a11y")
    if (stored) {
      try { return { ...defaultSettings, ...JSON.parse(stored) } } catch {}
    }
    return defaultSettings
  })

  useEffect(() => {
    localStorage.setItem("portfolio-a11y", JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("reduce-motion", settings.reducedMotion)
    root.classList.toggle("high-contrast", settings.highContrast)
    root.classList.toggle("no-focus-outline", !settings.focusOutline)
    root.style.fontSize = `${settings.fontSize}%`
    root.style.setProperty("--a11y-font", settings.fontFamily)
    root.style.zoom = `${settings.zoom}%`
  }, [settings])

  const toggleReducedMotion = useCallback(() =>
    setSettings(s => ({ ...s, reducedMotion: !s.reducedMotion })), [])
  const toggleHighContrast = useCallback(() =>
    setSettings(s => ({ ...s, highContrast: !s.highContrast })), [])
  const toggleFocusOutline = useCallback(() =>
    setSettings(s => ({ ...s, focusOutline: !s.focusOutline })), [])
  const increaseFont = useCallback(() =>
    setSettings(s => ({ ...s, fontSize: Math.min(s.fontSize + 10, 150) })), [])
  const decreaseFont = useCallback(() =>
    setSettings(s => ({ ...s, fontSize: Math.max(s.fontSize - 10, 70) })), [])
  const resetFont = useCallback(() =>
    setSettings(s => ({ ...s, fontSize: 100 })), [])
  const setFontFamily = useCallback((f: string) =>
    setSettings(s => ({ ...s, fontFamily: f })), [])
  const zoomIn = useCallback(() =>
    setSettings(s => ({ ...s, zoom: Math.min(s.zoom + 10, 150) })), [])
  const zoomOut = useCallback(() =>
    setSettings(s => ({ ...s, zoom: Math.max(s.zoom - 10, 70) })), [])
  const resetZoom = useCallback(() =>
    setSettings(s => ({ ...s, zoom: 100 })), [])

  return (
    <A11yContext.Provider value={{
      settings, toggleReducedMotion, toggleHighContrast,
      toggleFocusOutline, increaseFont, decreaseFont, resetFont,
      setFontFamily, zoomIn, zoomOut, resetZoom,
    }}>
      {children}
    </A11yContext.Provider>
  )
}

export const useA11y = () => useContext(A11yContext)
