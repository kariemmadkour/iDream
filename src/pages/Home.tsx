import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import ServicesPanels from '../components/ServicesPanels'
import ToolsList from '../components/ToolsList'
import Reveal from '../components/Reveal'

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <ServicesPanels />
      <section className="px-6 py-24 md:px-10">
        <Reveal>
          <p className="max-w-3xl text-2xl leading-snug text-paper/90 md:text-4xl">
            iDream Egypt is a small creative-technology studio — AI video, custom software,
            event production, and generative content —{' '}
            <span className="text-mist">
              plus a growing set of free browser tools we build and give back, no sign-up, no ads,
              nothing ever leaving your device.
            </span>
          </p>
        </Reveal>
      </section>
      <ToolsList />
      <section className="px-6 py-32 text-center md:px-10">
        <Reveal>
          <p className="font-mono-tag text-xs uppercase text-cyan">Get Started</p>
          <h2 className="mx-auto mt-6 max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl">
            Pick a tool. It's already free.
          </h2>
          <a
            href="#tools"
            data-cursor="View"
            className="font-mono-tag mt-10 inline-block rounded-full border border-cyan px-8 py-4 text-xs uppercase tracking-widest text-cyan transition-colors hover:bg-cyan hover:text-ink"
          >
            Browse Tools
          </a>
        </Reveal>
      </section>
    </>
  )
}
