import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { QrCode, ShieldCheck, Ruler, Braces, Hash, FileText, type LucideIcon } from 'lucide-react'
import { TOOLS } from '../data/tools'
import Reveal from './Reveal'

const ICONS: Record<string, LucideIcon> = {
  'qr-generator': QrCode,
  'password-vault': ShieldCheck,
  'unit-converter': Ruler,
  'json-toolkit': Braces,
  'hash-generator': Hash,
  'cv-maker': FileText,
}

export default function ToolsList() {
  const panelRef = useRef<HTMLDivElement>(null)
  const [activeSlug, setActiveSlug] = useState<string | null>(null)

  const onMove = (e: React.MouseEvent) => {
    if (!panelRef.current) return
    gsap.to(panelRef.current, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.5,
      ease: 'power3.out',
    })
  }

  return (
    <section id="tools" className="relative px-6 py-24 md:px-10" onMouseMove={onMove}>
      <Reveal>
        <p className="font-mono-tag text-xs uppercase text-cyan">Selected Tools</p>
      </Reveal>
      <div className="mt-8 border-t border-line">
        {TOOLS.map((tool, i) => {
          return (
            <Reveal key={tool.slug} delay={i * 0.04}>
              <Link
                to={`/tools/${tool.slug}`}
                data-cursor="View"
                onMouseEnter={() => setActiveSlug(tool.slug)}
                onMouseLeave={() => setActiveSlug(null)}
                className="group flex flex-col items-start justify-between gap-3 border-b border-line py-8 transition-colors md:flex-row md:items-center md:py-10"
              >
                <div className="flex items-baseline gap-6">
                  <span className="font-mono-tag text-sm text-mist">{tool.index}</span>
                  <h3 className="text-3xl font-semibold tracking-tight transition-colors group-hover:text-cyan md:text-5xl">
                    {tool.name}
                  </h3>
                </div>
                <div className="flex items-center gap-3 pl-12 md:pl-0">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono-tag rounded-full border border-line px-3 py-1 text-[10px] uppercase text-mist"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </Reveal>
          )
        })}
      </div>

      <div
        ref={panelRef}
        className="pointer-events-none fixed top-0 left-0 z-40 hidden h-56 w-72 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-2xl border border-line bg-panel/90 backdrop-blur transition-opacity duration-300 md:flex"
        style={{ opacity: activeSlug ? 1 : 0 }}
      >
        {activeSlug && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan/25 via-transparent to-sky/25" />
            {(() => {
              const tool = TOOLS.find((t) => t.slug === activeSlug)
              const Icon = tool ? ICONS[tool.slug] : null
              return Icon ? <Icon className="relative h-16 w-16 text-cyan" strokeWidth={1.25} /> : null
            })()}
          </>
        )}
      </div>
    </section>
  )
}
