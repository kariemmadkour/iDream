import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import HeroScene from './HeroScene'

export default function Hero() {
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([])

  useEffect(() => {
    gsap.fromTo(
      lineRefs.current,
      { yPercent: 110 },
      { yPercent: 0, duration: 1.1, stagger: 0.1, ease: 'power4.out', delay: 0.3 },
    )
    gsap.fromTo(
      '.hero-sub',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, delay: 1.1, ease: 'power3.out' },
    )
  }, [])

  return (
    <section className="relative flex h-screen w-full items-center overflow-hidden">
      <HeroScene />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink" />
      <div className="relative z-10 px-6 md:px-10">
        <h1 className="font-semibold leading-[0.92] tracking-tight">
          {['iDream', 'Egypt'].map((word, i) => (
            <span key={word} className="block overflow-hidden">
              <span
                ref={(el) => {
                  lineRefs.current[i] = el
                }}
                className="block text-[15vw] md:text-[9vw]"
              >
                {word}
              </span>
            </span>
          ))}
        </h1>
        <p className="hero-sub mt-6 max-w-md text-base text-mist md:text-lg">
          Free, secure, client-side digital tools — QR codes, password vaults, converters
          and more. Nothing you make here ever leaves your browser.
        </p>
      </div>
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center">
        <span className="font-mono-tag text-[10px] uppercase tracking-widest text-mist">
          Scroll
        </span>
        <div className="mx-auto mt-2 h-10 w-px animate-pulse bg-mist" />
      </div>
    </section>
  )
}
