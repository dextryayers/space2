"use client"

import { useState, useEffect } from "react"
import { FaLinkedinIn, FaTwitter, FaBehance, FaInstagram } from "react-icons/fa"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TeamMember {
  id: string
  name: string
  role: string
  image: string
  social?: {
    twitter?: string
    linkedin?: string
    instagram?: string
    behance?: string
  }
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Hanif Abdurrohim",
    role: "Fullstack Developer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face&q=60",
    social: { twitter: "#", linkedin: "#" },
  },
  {
    id: "2",
    name: "Alya Sabrina",
    role: "UI/UX Designer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face&q=60",
    social: { twitter: "#", linkedin: "#", behance: "#" },
  },
  {
    id: "3",
    name: "Rafi Akbar",
    role: "Security Engineer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face&q=60",
    social: { twitter: "#", linkedin: "#" },
  },
  {
    id: "4",
    name: "Sania Putri",
    role: "AI Engineer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face&q=60",
    social: { linkedin: "#" },
  },
  {
    id: "5",
    name: "Dimas Prayoga",
    role: "Network Architect",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face&q=60",
    social: { twitter: "#", linkedin: "#" },
  },
  {
    id: "6",
    name: "Nadia Kirana",
    role: "DevOps Engineer",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face&q=60",
    social: { instagram: "#" },
  },
  {
    id: "7",
    name: "Bima Sakti",
    role: "Cloud Architect",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face&q=60",
    social: { twitter: "#", linkedin: "#" },
  },
]

interface TeamShowcaseProps {
  members?: TeamMember[]
}

export default function TeamShowcase({ members = DEFAULT_MEMBERS }: TeamShowcaseProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [preview, setPreview] = useState<TeamMember | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreview(null)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = preview ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [preview])

  const col1 = members.filter((_, i) => i % 3 === 0)
  const col2 = members.filter((_, i) => i % 3 === 1)
  const col3 = members.filter((_, i) => i % 3 === 2)

  return (
    <>
    <div className="flex flex-col md:flex-row items-start gap-8 md:gap-10 lg:gap-14 select-none w-full max-w-5xl mx-auto py-8 px-0 font-sans">
      {/* ── Left: photo grid ── */}
      <div className="flex gap-2 md:gap-3 flex-shrink-0 overflow-x-auto pb-1 md:pb-0 max-w-full"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Column 1 */}
        <div className="flex flex-col gap-2 md:gap-3">
          {col1.map((member) => (
            <PhotoCard
              key={member.id}
              member={member}
              className="w-[140px] h-[150px] sm:w-[160px] sm:h-[170px] md:w-[190px] md:h-[200px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
              onClick={() => setPreview(member)}
            />
          ))}
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-2 md:gap-3 mt-[60px] sm:mt-[70px] md:mt-[85px]">
          {col2.map((member) => (
            <PhotoCard
              key={member.id}
              member={member}
              className="w-[155px] h-[165px] sm:w-[180px] sm:h-[190px] md:w-[210px] md:h-[220px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
              onClick={() => setPreview(member)}
            />
          ))}
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-2 md:gap-3 mt-[28px] sm:mt-[33px] md:mt-[40px]">
          {col3.map((member) => (
            <PhotoCard
              key={member.id}
              member={member}
              className="w-[145px] h-[155px] sm:w-[170px] sm:h-[180px] md:w-[200px] md:h-[210px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
              onClick={() => setPreview(member)}
            />
          ))}
        </div>
      </div>

      {/* ── Right: member name list ── */}
      <div className="flex flex-col sm:grid sm:grid-cols-2 md:flex md:flex-col gap-4 md:gap-5 pt-0 md:pt-2 flex-1 w-full">
        {members.map((member) => (
          <MemberRow
            key={member.id}
            member={member}
            hoveredId={hoveredId}
            onHover={setHoveredId}
          />
        ))}
      </div>
    </div>

      {/* ── Lightbox preview ── */}
      {preview && (
        <div
          className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
          onClick={() => setPreview(null)}
          role="dialog" aria-modal="true" aria-label={preview.name}
        >
          <button
            onClick={() => setPreview(null)}
            className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors"
            aria-label="Close lightbox"
          >
            <X size={20} />
          </button>

          <div
            className="relative w-full max-w-3xl flex flex-col md:flex-row gap-8 items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 overflow-hidden rounded-sm shadow-2xl shadow-black/40 ring-1 ring-white/5 flex-shrink-0">
              <img
                src={preview.image}
                alt={preview.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="font-mono text-[10px] tracking-[0.2em] text-gold/60 uppercase mb-2">
                {preview.role}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
                {preview.name}
              </h2>
              <div className="w-12 h-px bg-gold/40 mb-4" />
              <p className="text-sm text-foreground/50 max-w-md leading-relaxed mb-6">
                Specialist in {preview.role.toLowerCase()} with expertise in building scalable digital infrastructure.
              </p>
              {preview.social && (
                <div className="flex gap-3">
                  {preview.social.twitter && (
                    <a href={preview.social.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded text-foreground/30 hover:text-gold hover:bg-foreground/5 transition-all">
                      <FaTwitter size={14} />
                    </a>
                  )}
                  {preview.social.linkedin && (
                    <a href={preview.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded text-foreground/30 hover:text-gold hover:bg-foreground/5 transition-all">
                      <FaLinkedinIn size={14} />
                    </a>
                  )}
                  {preview.social.instagram && (
                    <a href={preview.social.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded text-foreground/30 hover:text-gold hover:bg-foreground/5 transition-all">
                      <FaInstagram size={14} />
                    </a>
                  )}
                  {preview.social.behance && (
                    <a href={preview.social.behance} target="_blank" rel="noopener noreferrer" className="p-2 rounded text-foreground/30 hover:text-gold hover:bg-foreground/5 transition-all">
                      <FaBehance size={14} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ─────────────────────────────────────────
   Photo card
───────────────────────────────────────── */

function PhotoCard({
  member,
  className,
  hoveredId,
  onHover,
  onClick,
}: {
  member: TeamMember
  className: string
  hoveredId: string | null
  onHover: (id: string | null) => void
  onClick: () => void
}) {
  const isActive = hoveredId === member.id
  const isDimmed = hoveredId !== null && !isActive

  return (
    <div
      className={cn(
        "overflow-hidden rounded-sm cursor-pointer flex-shrink-0 transition-all duration-400",
        className,
        isDimmed ? "opacity-50 saturate-0" : "opacity-100 saturate-100",
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
    >
      <div className="relative w-full h-full overflow-hidden">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover transition-all duration-500"
          loading="lazy"
          style={{
            filter: isActive
              ? "grayscale(0) brightness(1.05)"
              : "grayscale(0.85) brightness(0.7)",
          }}
        />
        {/* Gold border on active */}
        <div
          className={cn(
            "absolute inset-0 ring-1 transition-all duration-500 pointer-events-none",
            isActive ? "ring-gold/60 ring-2" : "ring-white/5",
          )}
        />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Member name section
───────────────────────────────────────── */

function MemberRow({
  member,
  hoveredId,
  onHover,
}: {
  member: TeamMember
  hoveredId: string | null
  onHover: (id: string | null) => void
}) {
  const isActive = hoveredId === member.id
  const isDimmed = hoveredId !== null && !isActive
  const hasSocial =
    member.social?.twitter ??
    member.social?.linkedin ??
    member.social?.instagram ??
    member.social?.behance

  return (
    <div
      className={cn(
        "cursor-pointer transition-all duration-300",
        isDimmed ? "opacity-40" : "opacity-100",
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Name + social */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <span
          className={cn(
            "w-4 h-[3px] rounded-sm flex-shrink-0 transition-all duration-300",
            isActive ? "bg-gold w-6" : "bg-foreground/20",
          )}
        />
        <span
          className={cn(
            "text-base md:text-lg font-semibold leading-none tracking-tight transition-colors duration-300",
            isActive ? "text-gold" : "text-foreground/80",
          )}
        >
          {member.name}
        </span>

        {/* Social icons */}
        {hasSocial && (
          <div
            className={cn(
              "flex items-center gap-1 transition-all duration-300",
              isActive
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-2 pointer-events-none",
            )}
          >
            {member.social?.twitter && (
              <a
                href={member.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-foreground/30 hover:text-gold hover:bg-foreground/5 transition-all duration-200 hover:scale-110"
                aria-label={`${member.name} Twitter`}
              >
                <FaTwitter size={10} />
              </a>
            )}
            {member.social?.linkedin && (
              <a
                href={member.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-foreground/30 hover:text-gold hover:bg-foreground/5 transition-all duration-200 hover:scale-110"
                aria-label={`${member.name} LinkedIn`}
              >
                <FaLinkedinIn size={10} />
              </a>
            )}
            {member.social?.instagram && (
              <a
                href={member.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-foreground/30 hover:text-gold hover:bg-foreground/5 transition-all duration-200 hover:scale-110"
                aria-label={`${member.name} Instagram`}
              >
                <FaInstagram size={10} />
              </a>
            )}
            {member.social?.behance && (
              <a
                href={member.social.behance}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-foreground/30 hover:text-gold hover:bg-foreground/5 transition-all duration-200 hover:scale-110"
                aria-label={`${member.name} Behance`}
              >
                <FaBehance size={10} />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Role */}
      <p className="mt-1.5 pl-[27px] text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/30">
        {member.role}
      </p>
    </div>
  )
}
