import { useState, useRef } from "react"
import { Send } from "lucide-react"
import { personalInfo } from "@/data/portfolio"
import { useLang } from "@/contexts/LanguageContext"
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa"

function InputField({ label, name, type = "text", placeholder, value, onChange, isTextarea = false }: {
  label: string; name: string; type?: string; placeholder: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; isTextarea?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  return (
    <div
      className={`bg-background p-6 transition-all duration-300 ${focused ? "border-l-2 border-gold" : "border-l-2 border-transparent"}`}
      onClick={() => {
        if (isTextarea && textareaRef.current) textareaRef.current.focus()
        else if (inputRef.current) inputRef.current.focus()
      }}
    >
      <label className={`block font-mono text-[9px] tracking-widest uppercase mb-3 transition-colors duration-300 ${focused ? "text-gold/60" : "text-foreground/20"}`}>
        {label}
      </label>
      {isTextarea ? (
        <textarea
          ref={textareaRef}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          rows={4}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent border-none outline-none text-foreground text-sm placeholder:text-foreground/10 focus:ring-0 p-0 resize-none"
        />
      ) : (
        <input
          ref={inputRef}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent border-none outline-none text-foreground text-sm placeholder:text-foreground/10 focus:ring-0 p-0"
        />
      )}
      <div className={`h-px mt-3 transition-all duration-300 ${focused ? "bg-gold/40" : "bg-foreground/[0.06]"}`} />
    </div>
  )
}

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [sent, setSent] = useState(false)
  const { t } = useLang()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div className="pt-20 md:pt-24 bg-background relative min-h-screen lg:pr-20">
      <span className="section-number hidden md:block">04</span>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="section-marker">// {t("contact.heading")}</span>
            <span className="w-12 h-px bg-gold/30" />
            <span className="font-mono text-[10px] text-foreground/15">04</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight">
            {t("contact.title")}
          </h1>
        </div>

        <div className="grid md:grid-cols-5 gap-12 md:gap-16">
          <div className="md:col-span-2 space-y-8">
            <div className="space-y-6">
              {[
                { label: t("contact.email"), value: personalInfo.email },
                { label: t("contact.location"), value: personalInfo.location },
                { label: t("contact.phone"), value: personalInfo.phone },
              ].map(({ label, value }) => (
                <div key={label} className="group">
                  <p className="font-mono text-[9px] text-foreground/20 tracking-widest uppercase mb-1 group-hover:text-gold/40 transition-colors duration-300">{label}</p>
                  <p className="text-foreground/70 text-sm">{value}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="font-mono text-[9px] text-foreground/20 tracking-widest uppercase mb-4">{t("contact.social")}</p>
              <div className="flex gap-5">
                <a href={`mailto:${personalInfo.socials.email}`} className="text-foreground/30 hover:text-gold/60 transition-colors duration-300" aria-label="Email me">
                  <FaEnvelope size={18} />
                </a>
                <a href={personalInfo.socials.github} target="_blank" rel="noopener noreferrer" className="text-foreground/30 hover:text-gold/60 transition-colors duration-300" aria-label="GitHub profile">
                  <FaGithub size={20} />
                </a>
                <a href={personalInfo.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-foreground/30 hover:text-gold/60 transition-colors duration-300" aria-label="LinkedIn profile">
                  <FaLinkedin size={20} />
                </a>
                <a href={personalInfo.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-foreground/30 hover:text-gold/60 transition-colors duration-300" aria-label="Instagram profile">
                  <FaInstagram size={20} />
                </a>
                <a href={personalInfo.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="text-foreground/30 hover:text-gold/60 transition-colors duration-300" aria-label="WhatsApp">
                  <FaWhatsapp size={20} />
                </a>
              </div>
            </div>

            <div className="border-l border-gold/30 pl-5">
              <p className="text-sm text-foreground/40 italic leading-relaxed">
                {t("contact.quote")}
              </p>
            </div>
          </div>

          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-px bg-foreground/[0.03]" aria-label={t("contact.title")}>
              <InputField label={t("contact.formName")} name="name" placeholder={t("contact.formNamePlaceholder")} value={form.name} onChange={handleChange} />
              <InputField label={t("contact.formEmail")} name="email" type="email" placeholder={t("contact.formEmailPlaceholder")} value={form.email} onChange={handleChange} />
              <InputField label={t("contact.formMessage")} name="message" placeholder={t("contact.formMessagePlaceholder")} value={form.message} onChange={handleChange} isTextarea />
              <div className="bg-background p-6">
                <button
                  type="submit"
                  className={`w-full text-sm font-medium tracking-wider uppercase py-4 flex items-center justify-center gap-3 group transition-all duration-300 ${
                    sent ? "bg-green-600 text-foreground" : "bg-gold text-ebony hover:bg-gold-light"
                  }`}
                >
                  {sent ? (
                    <>{t("contact.sent")} ✓</>
                  ) : (
                    <>
                      {t("contact.send")}
                      <Send size={14} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
