import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

export default function ToolLayout({
  index,
  title,
  description,
  children,
}: {
  index: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="mx-auto min-h-screen max-w-4xl px-6 pt-32 pb-24 md:px-0 print:p-0">
      <div className="print:hidden">
        <Link
          to="/"
          data-cursor="Back"
          className="inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-cyan"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <p className="font-mono-tag mt-10 text-xs uppercase text-cyan">Tool {index}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">{title}</h1>
        <p className="mt-4 max-w-xl text-mist">{description}</p>
      </div>
      <div className="mt-12 rounded-2xl border border-line bg-panel p-6 md:p-10 print:mt-0 print:rounded-none print:border-none print:bg-transparent print:p-0">
        {children}
      </div>
    </div>
  )
}
