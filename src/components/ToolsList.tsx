import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { QrCode, ShieldCheck, Ruler, Braces, Hash, FileText, type LucideIcon } from 'lucide-react'
import { TOOLS } from '../data/tools'
import Reveal from './Reveal'
import SpinBadge from './SpinBadge'

const ICONS: Record<string, LucideIcon> = {
  'qr-generator': QrCode,
  'password-vault': ShieldCheck,
  'unit-converter': Ruler,
  'json-toolkit': Braces,
  'hash-generator': Hash,
  'cv-maker': FileText,
}

// --- Follow-feel constants -------------------------------------------------
// Tune these to change how "heavy" the preview card feels.
const POSITION_DAMPING = 0.15 // 0-1 per frame: lower = more lag/weight, higher = snappier
const TILT_DAMPING = 0.15 // how quickly the tilt eases toward its target each frame
const TILT_SENSITIVITY = 0.6 // degrees of tilt per px/frame of horizontal velocity
const TILT_MAX = 12 // clamp, in degrees, so fast swipes don't over-rotate the card
// ----------------------------------------------------------------------------

export default function ToolsList() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const [hovering, setHovering] = useState(false)
  const isTouch = useRef(false)

  const mouse = useRef({ x: 0, y: 0 })
  const rendered = useRef({ x: 0, y: 0 })
  const lastMouse = useRef({ x: 0, y: 0 })
  const tilt = useRef(0)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    isTouch.current = window.matchMedia('(pointer: coarse)').matches
  }, [])

  const stopLoop = () => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current)
      rafId.current = null
    }
  }

  const tick = () => {
    rendered.current.x += (mouse.current.x - rendered.current.x) * POSITION_DAMPING
    rendered.current.y += (mouse.current.y - rendered.current.y) * POSITION_DAMPING

    const velocityX = mouse.current.x - lastMouse.current.x
    lastMouse.current.x = mouse.current.x
    lastMouse.current.y = mouse.current.y

    const targetTilt = Math.max(-TILT_MAX, Math.min(TILT_MAX, velocityX * TILT_SENSITIVITY))
    tilt.current += (targetTilt - tilt.current) * TILT_DAMPING

    if (cardRef.current) {
      cardRef.current.style.transform = `translate3d(${rendered.current.x}px, ${rendered.current.y}px, 0) translate(-50%, -50%) rotate(${tilt.current}deg)`
    }

    rafId.current = requestAnimationFrame(tick)
  }

  const handleListEnter = (e: React.MouseEvent) => {
    if (isTouch.current) return
    // Snap the tracked/rendered position to the cursor immediately so the card
    // appears where the pointer is, rather than lerping in from wherever it
    // was left after the last hover (e.g. the top-left origin).
    mouse.current = { x: e.clientX, y: e.clientY }
    rendered.current = { x: e.clientX, y: e.clientY }
    lastMouse.current = { x: e.clientX, y: e.clientY }
    tilt.current = 0
    setHovering(true)
    stopLoop()
    rafId.current = requestAnimationFrame(tick)
  }

  const handleListMove = (e: React.MouseEvent) => {
    if (isTouch.current) return
    mouse.current.x = e.clientX
    mouse.current.y = e.clientY
  }

  const handleListLeave = () => {
    if (isTouch.current) return
    setHovering(false)
    setActiveSlug(null)
    stopLoop()
  }

  // Safety net: cancel any in-flight frame if the list unmounts mid-hover
  // (e.g. the user clicks a row and navigates away).
  useEffect(() => stopLoop, [])

  return (
    <section id="tools" className="relative px-6 py-24 md:px-10">
      <Reveal>
        <p className="font-mono-tag text-xs uppercase text-cyan">Selected Tools</p>
      </Reveal>

      <div
        onMouseEnter={handleListEnter}
        onMouseMove={handleListMove}
        onMouseLeave={handleListLeave}
        className="mt-8 border-t border-line"
      >
        {TOOLS.map((tool, i) => (
          <Reveal key={tool.slug} delay={i * 0.04}>
            <Link
              to={`/tools/${tool.slug}`}
              onMouseEnter={() => setActiveSlug(tool.slug)}
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
        ))}
      </div>

      {/*
        Two-layer card: the outer element's transform (position + tilt) is
        written directly every animation frame from `tick()` above — it never
        goes through React state, so hover/crossfade re-renders can't stutter
        the follow motion. The inner element's opacity/scale is plain CSS,
        driven by the `hovering` boolean, and is what's responsible for the
        grow-in/fade-in — the two never fight over the same transform.
      */}
      <div
        ref={cardRef}
        className="pointer-events-none fixed top-0 left-0 z-40 hidden md:block"
        style={{ willChange: 'transform' }}
      >
        <div
          className="h-56 w-72 overflow-hidden rounded-2xl border border-line bg-panel/90 backdrop-blur transition-all duration-[350ms] ease-out"
          style={{
            opacity: hovering ? 1 : 0,
            transform: hovering ? 'scale(1)' : 'scale(0.85)',
          }}
        >
          <div className="relative h-full w-full">
            {TOOLS.map((tool) => {
              const Icon = ICONS[tool.slug]
              return (
                <div
                  key={tool.slug}
                  className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cyan/25 via-transparent to-sky/25 transition-opacity duration-200 ease-out"
                  style={{ opacity: activeSlug === tool.slug ? 1 : 0 }}
                >
                  <Icon className="h-16 w-16 text-cyan" strokeWidth={1.25} />
                </div>
              )
            })}
            <div className="absolute inset-0 flex items-center justify-center">
              <SpinBadge />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
