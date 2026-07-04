import { useMemo, useState } from 'react'
import { ArrowRightLeft } from 'lucide-react'
import ToolLayout from '../../components/ToolLayout'
import { TOOLS } from '../../data/tools'
import { UNIT_CATEGORIES } from '../../lib/units'

const meta = TOOLS.find((t) => t.slug === 'unit-converter')!

export default function UnitConverter() {
  const [categoryId, setCategoryId] = useState(UNIT_CATEGORIES[0].id)
  const category = useMemo(() => UNIT_CATEGORIES.find((c) => c.id === categoryId)!, [categoryId])
  const [from, setFrom] = useState(category.units[0].id)
  const [to, setTo] = useState(category.units[1]?.id ?? category.units[0].id)
  const [value, setValue] = useState('1')

  const changeCategory = (id: string) => {
    const cat = UNIT_CATEGORIES.find((c) => c.id === id)!
    setCategoryId(id)
    setFrom(cat.units[0].id)
    setTo(cat.units[1]?.id ?? cat.units[0].id)
  }

  const result = useMemo(() => {
    const num = parseFloat(value)
    if (Number.isNaN(num)) return ''
    const converted = category.convert(num, from, to)
    return Number(converted.toPrecision(10)).toString()
  }, [category, from, to, value])

  return (
    <ToolLayout index={meta.index} title={meta.name} description={meta.tagline}>
      <div className="flex flex-wrap gap-2">
        {UNIT_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => changeCategory(c.id)}
            className={`font-mono-tag rounded-full border px-4 py-2 text-[10px] uppercase tracking-widest transition-colors ${
              c.id === categoryId
                ? 'border-cyan bg-cyan text-ink'
                : 'border-line text-mist hover:border-cyan hover:text-cyan'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-xl border border-line bg-ink p-5">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-transparent text-2xl font-semibold outline-none"
          />
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="font-mono-tag mt-3 w-full rounded-lg border border-line bg-panel px-3 py-2 text-xs uppercase"
          >
            {category.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            setFrom(to)
            setTo(from)
          }}
          data-cursor="Swap"
          className="mx-auto rounded-full border border-line p-3 text-mist hover:border-cyan hover:text-cyan"
        >
          <ArrowRightLeft className="h-4 w-4" />
        </button>

        <div className="rounded-xl border border-cyan/40 bg-ink p-5">
          <p className="truncate text-2xl font-semibold text-cyan">{result || '—'}</p>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="font-mono-tag mt-3 w-full rounded-lg border border-line bg-panel px-3 py-2 text-xs uppercase"
          >
            {category.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </ToolLayout>
  )
}
