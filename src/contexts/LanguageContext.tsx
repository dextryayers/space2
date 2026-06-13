import { createContext, useCallback, useContext, useState } from "react"
import { en } from "@/i18n/en"
import { id } from "@/i18n/id"

export type Lang = "en" | "id"
type TranslationValue = string | string[] | { [key: string]: TranslationValue } | unknown[]

const bundles: Record<Lang, Record<string, TranslationValue>> = { en, id }

const LanguageContext = createContext<{
  lang: Lang
  setLang: (l: Lang) => void
  t: (path: string) => string
  tArray: (path: string) => string[]
  tData: (path: string) => unknown
}>({
  lang: "en",
  setLang: () => {},
  t: (p: string) => p,
  tArray: () => [],
  tData: () => null,
})

function resolve(obj: Record<string, TranslationValue>, path: string): TranslationValue | undefined {
  const keys = path.split(".")
  let current: TranslationValue = obj
  for (const key of keys) {
    if (current && typeof current === "object" && !Array.isArray(current)) {
      current = (current as Record<string, TranslationValue>)[key]
    } else {
      return undefined
    }
  }
  return current
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem("portfolio-lang")
    if (stored === "id" || stored === "en") return stored
    const browserLang = navigator.language?.startsWith("id") ? "id" : "en"
    return browserLang
  })

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem("portfolio-lang", l)
  }, [])

  const t = useCallback(
    (path: string): string => {
      const val = resolve(bundles[lang], path)
      return typeof val === "string" ? val : path
    },
    [lang],
  )

  const tArray = useCallback(
    (path: string): string[] => {
      const val = resolve(bundles[lang], path)
      return Array.isArray(val) ? (val as string[]) : []
    },
    [lang],
  )

  const tData = useCallback(
    (path: string): unknown => {
      return resolve(bundles[lang], path)
    },
    [lang],
  )

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tArray, tData }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
