import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Download } from 'lucide-react'
import ToolLayout from '../../components/ToolLayout'
import { TOOLS } from '../../data/tools'

const meta = TOOLS.find((t) => t.slug === 'qr-generator')!

export default function QrGenerator() {
  const [text, setText] = useState('https://idreamegypt.com')
  const [dataUrl, setDataUrl] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (!text) {
      setDataUrl('')
      return
    }
    QRCode.toCanvas(canvas, text, {
      width: 320,
      margin: 2,
      color: { dark: '#020408', light: '#f8fafc' },
    })
      .then(() => setDataUrl(canvas.toDataURL('image/png')))
      .catch(() => setDataUrl(''))
  }, [text])

  const download = (format: 'png' | 'svg') => {
    if (format === 'png') {
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'qr-code.png'
      a.click()
      return
    }
    QRCode.toString(text, { type: 'svg', margin: 2, color: { dark: '#020408', light: '#f8fafc' } }).then(
      (svg) => {
        const blob = new Blob([svg], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'qr-code.svg'
        a.click()
        URL.revokeObjectURL(url)
      },
    )
  }

  return (
    <ToolLayout index={meta.index} title={meta.name} description={meta.tagline}>
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <label className="font-mono-tag text-xs uppercase text-mist">Link or text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="mt-3 w-full resize-none rounded-xl border border-line bg-ink px-4 py-3 text-sm outline-none focus:border-cyan"
            placeholder="https://example.com"
          />
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => download('png')}
              disabled={!dataUrl}
              data-cursor="Save"
              className="font-mono-tag inline-flex items-center gap-2 rounded-full border border-cyan px-5 py-3 text-xs uppercase tracking-widest text-cyan transition-colors hover:bg-cyan hover:text-ink disabled:opacity-40"
            >
              <Download className="h-3.5 w-3.5" /> PNG
            </button>
            <button
              onClick={() => download('svg')}
              disabled={!text}
              data-cursor="Save"
              className="font-mono-tag inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-xs uppercase tracking-widest text-mist transition-colors hover:border-cyan hover:text-cyan disabled:opacity-40"
            >
              <Download className="h-3.5 w-3.5" /> SVG
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center rounded-xl bg-ink p-6">
          <canvas ref={canvasRef} className="max-w-full rounded-lg" />
        </div>
      </div>
    </ToolLayout>
  )
}
