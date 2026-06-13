import { personalInfo } from "@/data/portfolio"
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa"
import { useLang } from "@/contexts/LanguageContext"

export function Footer() {
  const year = new Date().getFullYear()
  const { t } = useLang()

  return (
    <footer className="relative border-t border-border/[0.04] bg-background lg:pr-20" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left */}
          <div className="text-center md:text-left">
            <p className="font-mono text-[10px] text-foreground/20 tracking-wider">
              &copy; {year} {personalInfo.name}. {t("footer.rights")}
            </p>
          </div>

          {/* Center */}
          <nav aria-label="Footer navigation" className="flex gap-6">
            <a href="#/" className="font-mono text-[9px] text-foreground/20 hover:text-gold/60 transition-colors tracking-widest uppercase">
              {t("nav.index")}
            </a>
            <a href="#/about" className="font-mono text-[9px] text-foreground/20 hover:text-gold/60 transition-colors tracking-widest uppercase">
              {t("nav.profile")}
            </a>
            <a href="#/contact" className="font-mono text-[9px] text-foreground/20 hover:text-gold/60 transition-colors tracking-widest uppercase">
              {t("nav.contact")}
            </a>
          </nav>

          {/* Right */}
          <div className="flex gap-4">
            <a href={personalInfo.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-foreground/20 hover:text-gold/60 transition-colors">
              <FaGithub size={16} />
            </a>
            <a href={personalInfo.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-foreground/20 hover:text-gold/60 transition-colors">
              <FaLinkedin size={16} />
            </a>
            <a href={personalInfo.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-foreground/20 hover:text-gold/60 transition-colors">
              <FaInstagram size={16} />
            </a>
            <a href={personalInfo.socials.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-foreground/20 hover:text-gold/60 transition-colors">
              <FaWhatsapp size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
