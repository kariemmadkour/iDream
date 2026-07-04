import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 mix-blend-difference md:px-10 print:hidden">
      <Link to="/" data-cursor="Home" className="font-mono-tag text-sm font-medium">
        iDream<span className="text-cyan">.</span>Egypt
      </Link>
      <a
        href="#tools"
        data-cursor="View"
        className="font-mono-tag hidden text-xs uppercase tracking-widest md:block"
      >
        Tools ({new Date().getFullYear()})
      </a>
    </header>
  )
}
