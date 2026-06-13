import { HashRouter, Routes, Route, useLocation } from "react-router-dom"
import { lazy, Suspense, useEffect } from "react"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { LanguageProvider, useLang } from "@/contexts/LanguageContext"
import { A11yProvider } from "@/contexts/AccessibilityContext"
import { Navbar } from "@/components/layout/Navbar"
import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher"
import { AccessibilityPanel } from "@/components/layout/AccessibilityPanel"
import { Footer } from "@/components/layout/Footer"
import { HomePage } from "@/pages/HomePage"
import { NotFoundPage } from "@/pages/NotFoundPage"

const AboutPage = lazy(() => import("@/pages/AboutPage").then(m => ({ default: m.AboutPage })))
const GalleryPage = lazy(() => import("@/pages/GalleryPage").then(m => ({ default: m.GalleryPage })))
const ProjectsPage = lazy(() => import("@/pages/ProjectsPage").then(m => ({ default: m.ProjectsPage })))
const ExperiencePage = lazy(() => import("@/pages/ExperiencePage").then(m => ({ default: m.ExperiencePage })))
const CertificatesPage = lazy(() => import("@/pages/CertificatesPage").then(m => ({ default: m.CertificatesPage })))
const ContactPage = lazy(() => import("@/pages/ContactPage").then(m => ({ default: m.ContactPage })))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  )
}

function SkipLink() {
  return (
    <a href="#main-content" className="skip-to-content">
      Skip to main content
    </a>
  )
}

const pageDescriptions: Record<string, { en: string; id: string }> = {
  "/": {
    en: "Portfolio of Hanif Abdurrohim — Software Engineer and Cybersecurity Professional based in Surabaya, Indonesia.",
    id: "Portofolio Hanif Abdurrohim — Software Engineer dan Profesional Keamanan Siber berbasis di Surabaya, Indonesia.",
  },
  "/about": {
    en: "Learn about Hanif Abdurrohim's background, skills in web development and cybersecurity, professional principles, and personal manifesto.",
    id: "Pelajari latar belakang Hanif Abdurrohim, keterampilan dalam pengembangan web dan keamanan siber, prinsip profesional, dan manifesto pribadi.",
  },
  "/gallery": {
    en: "Meet the team — gallery showcasing collaborative projects and team members.",
    id: "Kenali tim — galeri yang menampilkan proyek kolaboratif dan anggota tim.",
  },
  "/projects": {
    en: "Explore projects by Hanif Abdurrohim including web applications, security tools, and full-stack platforms.",
    id: "Jelajahi proyek oleh Hanif Abdurrohim termasuk aplikasi web, alat keamanan, dan platform full-stack.",
  },
  "/experience": {
    en: "Professional experience timeline and certifications of Hanif Abdurrohim in software engineering and cybersecurity.",
    id: "Linimasa pengalaman profesional dan sertifikasi Hanif Abdurrohim di bidang rekayasa perangkat lunak dan keamanan siber.",
  },
  "/certificates": {
    en: "Professional certificates and credentials in cybersecurity, web development, and network security.",
    id: "Sertifikat profesional dan kredensial di bidang keamanan siber, pengembangan web, dan keamanan jaringan.",
  },
  "/contact": {
    en: "Contact Hanif Abdurrohim for collaboration, project inquiries, or professional opportunities.",
    id: "Hubungi Hanif Abdurrohim untuk kolaborasi, pertanyaan proyek, atau kesempatan profesional.",
  },
}

function MetaUpdater() {
  const location = useLocation()
  const { lang } = useLang()
  const titles: Record<string, string> = {
    "/": "Hanif Abdurrohim Portofolio Web",
    "/about": "Profile - Hanif Abdurrohim",
    "/gallery": "Gallery - MyGallery",
    "/projects": "Project - My Work",
    "/experience": "Experience - My Experience",
    "/certificates": "Certificate - My Achievement",
    "/contact": "Contact - Contact me",
  }
  useEffect(() => {
    const title = titles[location.pathname]
    document.title = title || "Hanif Abdurrohim Portofolio Web"
    document.documentElement.lang = lang

    const ogLocale = document.querySelector('meta[property="og:locale"]')
    if (ogLocale) ogLocale.setAttribute("content", lang === "id" ? "id_ID" : "en_US")

    const desc = pageDescriptions[location.pathname]
    let metaDesc = document.querySelector('meta[name="description"]')
    if (desc) {
      const text = desc[lang as keyof typeof desc] || desc.en
      if (metaDesc) metaDesc.setAttribute("content", text)
    }
  }, [location.pathname, lang])
  return null
}

function BreadcrumbJsonLd() {
  const location = useLocation()
  useEffect(() => {
    const crumbs = [
      { name: "Home", url: "https://haniipp.space/#/" },
    ]
    if (location.pathname !== "/") {
      const names: Record<string, string> = {
        "/about": "About",
        "/gallery": "Gallery",
        "/projects": "Projects",
        "/experience": "Experience",
        "/certificates": "Certificates",
        "/contact": "Contact",
      }
      crumbs.push({
        name: names[location.pathname] || "Page",
        url: `https://haniipp.space/#${location.pathname}`,
      })
    }
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.id = "breadcrumb-jsonld"
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        item: c.url,
      })),
    })
    const old = document.getElementById("breadcrumb-jsonld")
    if (old) old.remove()
    document.head.appendChild(script)
    return () => { const el = document.getElementById("breadcrumb-jsonld"); if (el) el.remove() }
  }, [location.pathname])
  return null
}

function WebPageJsonLd() {
  const location = useLocation()
  const { lang } = useLang()
  useEffect(() => {
    const desc = pageDescriptions[location.pathname]
    const text = desc ? (desc[lang as keyof typeof desc] || desc.en) : ""
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.id = "webpage-jsonld"
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: document.title,
      description: text,
      url: `https://haniipp.space/#${location.pathname}`,
      inLanguage: lang === "id" ? "id" : "en",
      isPartOf: {
        "@type": "WebSite",
        name: "Hanif Abdurrohim Portfolio",
        url: "https://haniipp.space/",
      },
    })
    const old = document.getElementById("webpage-jsonld")
    if (old) old.remove()
    document.head.appendChild(script)
    return () => { const el = document.getElementById("webpage-jsonld"); if (el) el.remove() }
  }, [location.pathname, lang])
  return null
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <A11yProvider>
          <HashRouter>
            <SkipLink />
            <Navbar />
            <ThemeSwitcher />
            <AccessibilityPanel />
            <main id="main-content" tabIndex={-1}>
              <MetaUpdater />
              <BreadcrumbJsonLd />
              <WebPageJsonLd />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/gallery" element={<GalleryPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/experience" element={<ExperiencePage />} />
                  <Route path="/certificates" element={<CertificatesPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
              <Footer />
            </main>
          </HashRouter>
        </A11yProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
