import { Link } from 'react-router-dom'
import { TOOLS } from '../data/tools'

export default function Footer() {
  return (
    <footer className="border-t border-line px-6 py-16 md:px-10 print:hidden">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="font-mono-tag text-sm">
              iDream<span className="text-cyan">.</span>Egypt
            </p>
            <p className="mt-4 max-w-xs text-sm text-mist">
              Free, secure, client-side digital tools. Nothing you make here ever touches a server.
            </p>
          </div>
          <div>
            <p className="font-mono-tag text-xs uppercase text-mist">Tools</p>
            <ul className="mt-4 space-y-2">
              {TOOLS.map((t) => (
                <li key={t.slug}>
                  <Link
                    to={`/tools/${t.slug}`}
                    data-cursor="Open"
                    className="text-sm text-paper/80 transition-colors hover:text-cyan"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono-tag text-xs uppercase text-mist">Contact</p>
            <ul className="mt-4 space-y-2 text-sm text-paper/80">
              <li>
                <a href="mailto:hello@idreamegypt.com" className="hover:text-cyan">
                  hello@idreamegypt.com
                </a>
              </li>
              <li className="text-mist">Cairo, Egypt</li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-4 border-t border-line pt-6 text-xs text-mist md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} iDream Egypt. All rights reserved.</span>
          <span className="font-mono-tag">100% client-side · No accounts · No tracking</span>
        </div>
      </div>
    </footer>
  )
}
