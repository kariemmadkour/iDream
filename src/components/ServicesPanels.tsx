import ServicePanel from './ServicePanel'
import Reveal from './Reveal'
import { SERVICES } from '../data/services'

export default function ServicesPanels() {
  return (
    <section className="px-6 py-24 md:px-10">
      <Reveal>
        <p className="font-mono-tag text-xs uppercase text-cyan">What We Do</p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
          Five ways we bring ideas to life.
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service, i) => (
          <div key={service.slug} className={i === 0 ? 'lg:col-span-2' : undefined}>
            <ServicePanel service={service} index={i} />
          </div>
        ))}
      </div>
    </section>
  )
}
