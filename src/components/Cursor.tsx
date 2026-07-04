import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const ringPos = { x: 0, y: 0 }
    const onMove = (e: MouseEvent) => {
      gsap.set(dot, { x: e.clientX, y: e.clientY })
      gsap.to(ringPos, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.35,
        ease: 'power3.out',
        onUpdate: () => gsap.set(ring, { x: ringPos.x, y: ringPos.y }),
      })
    }

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.('[data-cursor]') as HTMLElement | null
      if (target) {
        setLabel(target.dataset.cursor || '')
        gsap.to(ring, { scale: 2.6, duration: 0.3, ease: 'power2.out' })
        gsap.to(dot, { opacity: 0, duration: 0.2 })
      }
    }
    const onOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.('[data-cursor]')
      if (target) {
        setLabel('')
        gsap.to(ring, { scale: 1, duration: 0.3, ease: 'power2.out' })
        gsap.to(dot, { opacity: 1, duration: 0.2 })
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mouseout', onOut)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mouseout', onOut)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[999] hidden md:block">
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -ml-5 -mt-5 flex h-10 w-10 items-center justify-center rounded-full border border-cyan/70 transition-colors"
      >
        {label && <span className="font-mono-tag text-[9px] uppercase text-cyan">{label}</span>}
      </div>
      <div ref={dotRef} className="fixed top-0 left-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-paper" />
    </div>
  )
}
