import { useEffect, useState } from 'react'
import { Copy, Check } from 'lucide-react'
import ToolLayout from '../../components/ToolLayout'
import { TOOLS } from '../../data/tools'
import { computeHash, HASH_ALGOS, type HashAlgo } from '../../lib/hash'

const meta = TOOLS.find((t) => t.slug === 'hash-generator')!

export default function HashGenerator() {
  const [input, setInput] = useState('iDream Egypt')
  const [hashes, setHashes] = useState<Record<HashAlgo, string>>({} as Record<HashAlgo, string>)
  const [copiedAlgo, setCopiedAlgo] = useState<HashAlgo | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all(HASH_ALGOS.map((algo) => computeHash(algo, input))).then((results) => {
      if (cancelled) return
      const next = {} as Record<HashAlgo, string>
      HASH_ALGOS.forEach((algo, i) => (next[algo] = results[i]))
      setHashes(next)
    })
    return () => {
      cancelled = true
    }
  }, [input])

  const copy = (algo: HashAlgo) => {
    navigator.clipboard.writeText(hashes[algo] ?? '')
    setCopiedAlgo(algo)
    setTimeout(() => setCopiedAlgo(null), 1500)
  }

  return (
    <ToolLayout index={meta.index} title={meta.name} description={meta.tagline}>
      <label className="font-mono-tag text-xs uppercase text-mist">Input text</label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={3}
        className="mt-3 w-full resize-none rounded-xl border border-line bg-ink px-4 py-3 text-sm outline-none focus:border-cyan"
      />
      <ul className="mt-8 space-y-3">
        {HASH_ALGOS.map((algo) => (
          <li key={algo} className="rounded-xl border border-line p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono-tag text-xs uppercase text-cyan">{algo}</span>
              <button
                onClick={() => copy(algo)}
                className="flex items-center gap-1 text-xs text-mist hover:text-cyan"
              >
                {copiedAlgo === algo ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <p className="font-mono-tag mt-2 break-all text-sm text-paper/80">
              {hashes[algo] ?? '…'}
            </p>
          </li>
        ))}
      </ul>
    </ToolLayout>
  )
}
