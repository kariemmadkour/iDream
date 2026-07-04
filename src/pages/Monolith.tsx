import MonolithScene from '../components/monolith/MonolithScene'

export default function Monolith() {
  return (
    <div className="relative">
      <div className="fixed inset-0">
        <MonolithScene className="h-full w-full" />
      </div>

      <div className="pointer-events-none fixed bottom-8 left-1/2 z-10 -translate-x-1/2 text-center">
        <span className="font-mono-tag text-[10px] uppercase tracking-widest text-mist">
          Drag to orbit · Scroll to travel
        </span>
      </div>

      {/* Scroll spacer: gives the page enough scrollable height for the
          Phase 3 camera-travel effect to have something to respond to. */}
      <div className="h-[400vh]" />
    </div>
  )
}
