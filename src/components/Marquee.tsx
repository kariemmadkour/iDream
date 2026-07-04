import { TOOLS } from '../data/tools'

export default function Marquee() {
  const items = [...TOOLS, ...TOOLS]
  return (
    <div className="overflow-hidden border-y border-line py-6">
      <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
        {items.map((tool, i) => (
          <span key={i} className="font-mono-tag text-sm uppercase text-mist">
            {tool.name} <span className="text-cyan">/</span>
          </span>
        ))}
      </div>
    </div>
  )
}
