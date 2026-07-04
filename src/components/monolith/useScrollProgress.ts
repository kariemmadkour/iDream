import { useEffect, useRef } from 'react'

// Tracks how far the page has scrolled, normalized to 0-1, in a ref so
// consumers can read it inside a useFrame loop without triggering re-renders
// on every scroll event.
export default function useScrollProgress() {
  const progress = useRef(0)

  useEffect(() => {
    let ticking = false
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      progress.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      ticking = false
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
    }
  }, [])

  return progress
}
