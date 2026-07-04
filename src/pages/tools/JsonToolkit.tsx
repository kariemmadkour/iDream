import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import ToolLayout from '../../components/ToolLayout'
import { TOOLS } from '../../data/tools'

const meta = TOOLS.find((t) => t.slug === 'json-toolkit')!

export default function JsonToolkit() {
  const [input, setInput] = useState('{\n  "hello": "world"\n}')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const run = (mode: 'format' | 'minify') => {
    try {
      const parsed = JSON.parse(input)
      setOutput(mode === 'format' ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed))
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
      setOutput('')
    }
  }

  const copy = () => {
    if (!output) return
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolLayout index={meta.index} title={meta.name} description={meta.tagline}>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="font-mono-tag text-xs uppercase text-mist">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={14}
            className="font-mono-tag mt-3 w-full resize-none rounded-xl border border-line bg-ink px-4 py-3 text-xs outline-none focus:border-cyan"
          />
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => run('format')}
              data-cursor="Run"
              className="font-mono-tag rounded-full border border-cyan px-5 py-3 text-xs uppercase tracking-widest text-cyan hover:bg-cyan hover:text-ink"
            >
              Format
            </button>
            <button
              onClick={() => run('minify')}
              data-cursor="Run"
              className="font-mono-tag rounded-full border border-line px-5 py-3 text-xs uppercase tracking-widest text-mist hover:border-cyan hover:text-cyan"
            >
              Minify
            </button>
          </div>
          {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="font-mono-tag text-xs uppercase text-mist">Output</label>
            <button onClick={copy} className="flex items-center gap-1 text-xs text-mist hover:text-cyan">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="font-mono-tag mt-3 h-[calc(100%-2rem)] min-h-[280px] overflow-auto rounded-xl border border-line bg-ink px-4 py-3 text-xs whitespace-pre-wrap">
            {output || ' '}
          </pre>
        </div>
      </div>
    </ToolLayout>
  )
}
