import { useState } from 'react'
import { Printer, Plus, Trash2 } from 'lucide-react'
import ToolLayout from '../../components/ToolLayout'
import { TOOLS } from '../../data/tools'

const meta = TOOLS.find((t) => t.slug === 'cv-maker')!

interface Experience {
  id: string
  role: string
  company: string
  period: string
  details: string
}

export default function CvMaker() {
  const [name, setName] = useState('Karim Madkour')
  const [title, setTitle] = useState('Product Engineer')
  const [contact, setContact] = useState('karim@example.com · Cairo, Egypt')
  const [summary, setSummary] = useState(
    'Builder of digital products and client-side tools, focused on clean UX and secure, privacy-respecting software.',
  )
  const [experiences, setExperiences] = useState<Experience[]>([
    { id: crypto.randomUUID(), role: 'Founder', company: 'iDream Egypt', period: '2024 — Present', details: 'Built and shipped a suite of free client-side utility tools.' },
  ])

  const addExperience = () =>
    setExperiences((e) => [...e, { id: crypto.randomUUID(), role: '', company: '', period: '', details: '' }])

  const updateExperience = (id: string, patch: Partial<Experience>) =>
    setExperiences((e) => e.map((x) => (x.id === id ? { ...x, ...patch } : x)))

  const removeExperience = (id: string) => setExperiences((e) => e.filter((x) => x.id !== id))

  return (
    <ToolLayout index={meta.index} title={meta.name} description={meta.tagline}>
      <div className="flex justify-end print:hidden">
        <button
          onClick={() => window.print()}
          data-cursor="Print"
          className="font-mono-tag inline-flex items-center gap-2 rounded-full border border-cyan px-5 py-3 text-xs uppercase tracking-widest text-cyan hover:bg-cyan hover:text-ink"
        >
          <Printer className="h-3.5 w-3.5" /> Export as PDF
        </button>
      </div>

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div className="space-y-4 print:hidden">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm outline-none focus:border-cyan"
          />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm outline-none focus:border-cyan"
          />
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Contact line"
            className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm outline-none focus:border-cyan"
          />
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            placeholder="Summary"
            className="w-full resize-none rounded-lg border border-line bg-ink px-3 py-2 text-sm outline-none focus:border-cyan"
          />

          <div className="flex items-center justify-between pt-4">
            <p className="font-mono-tag text-xs uppercase text-mist">Experience</p>
            <button onClick={addExperience} className="text-mist hover:text-cyan">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {experiences.map((exp) => (
            <div key={exp.id} className="space-y-2 rounded-lg border border-line p-3">
              <div className="flex gap-2">
                <input
                  value={exp.role}
                  onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                  placeholder="Role"
                  className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm outline-none focus:border-cyan"
                />
                <button onClick={() => removeExperience(exp.id)} className="shrink-0 text-mist hover:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <input
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                placeholder="Company"
                className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm outline-none focus:border-cyan"
              />
              <input
                value={exp.period}
                onChange={(e) => updateExperience(exp.id, { period: e.target.value })}
                placeholder="Period"
                className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm outline-none focus:border-cyan"
              />
              <textarea
                value={exp.details}
                onChange={(e) => updateExperience(exp.id, { details: e.target.value })}
                rows={2}
                placeholder="Details"
                className="w-full resize-none rounded-lg border border-line bg-ink px-3 py-2 text-sm outline-none focus:border-cyan"
              />
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-paper p-8 text-ink print:rounded-none print:p-0 print:text-black">
          <h2 className="text-2xl font-bold">{name || 'Your Name'}</h2>
          <p className="text-sm text-sky">{title}</p>
          <p className="mt-1 text-xs text-black/60">{contact}</p>
          <p className="mt-4 text-sm">{summary}</p>
          <div className="mt-6 space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-semibold">
                    {exp.role} {exp.company && `· ${exp.company}`}
                  </p>
                  <p className="text-xs text-black/50">{exp.period}</p>
                </div>
                <p className="mt-1 text-xs text-black/70">{exp.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
