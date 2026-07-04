import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Service } from '../data/services'

gsap.registerPlugin(ScrollTrigger)

const CROSSFADE_INTERVAL_MS = 5000

export default function ServicePanel({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      // Flies in from below at a slight 3D tilt and settles flat — the same
      // "fly in, settle" read as the tool-list hover card, but scroll-triggered
      // instead of cursor-triggered since these are static content tiles.
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: 70,
          scale: 0.92,
          rotateX: -10,
          rotateY: index % 2 === 0 ? -10 : 10,
          filter: 'blur(8px)',
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'power3.out',
          delay: (index % 3) * 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%' },
        },
      )
    })
    return () => ctx.revert()
  }, [index])

  useEffect(() => {
    if (service.images.length < 2) return
    const id = setInterval(() => {
      setActiveImage((i) => (i + 1) % service.images.length)
    }, CROSSFADE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [service.images])

  return (
    <div style={{ perspective: '1200px' }}>
      <div
        ref={ref}
        className="glass-panel group relative flex h-80 flex-col justify-end overflow-hidden rounded-3xl md:h-96"
      >
        {service.images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out"
            style={{ opacity: i === activeImage ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
        <div className="relative z-10 p-7 md:p-8">
          <h3 className="text-2xl font-semibold tracking-tight text-paper md:text-3xl">
            {service.title}
          </h3>
          <p className="mt-3 max-w-md text-sm text-paper/80 md:text-base">{service.description}</p>
        </div>
        {service.href && (
          <a
            href={service.href}
            data-cursor="View"
            className="absolute inset-0 z-20"
            aria-label={service.title}
          />
        )}
      </div>
    </div>
  )
}
