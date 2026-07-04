// Two independent layers: the ring (Layer A) spins forever via CSS animation;
// the "VIEW" label (Layer B) is a separate element that never rotates, so it
// stays upright and readable while the ring spins underneath/around it.
export default function SpinBadge() {
  return (
    <div className="relative h-16 w-16">
      <svg
        className="spin-badge-ring absolute inset-0 h-full w-full text-cyan"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 8" />
      </svg>
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono-tag text-[9px] font-medium tracking-widest text-paper">
        VIEW
      </span>
    </div>
  )
}
