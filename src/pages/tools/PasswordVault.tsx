import { useState } from 'react'
import { Lock, Plus, Trash2, Eye, EyeOff, Unlock } from 'lucide-react'
import ToolLayout from '../../components/ToolLayout'
import { TOOLS } from '../../data/tools'
import {
  encryptVault,
  decryptVault,
  VAULT_STORAGE_KEY,
  type VaultEntry,
  type EncryptedBlob,
} from '../../lib/vaultCrypto'

const meta = TOOLS.find((t) => t.slug === 'password-vault')!

function genPassword(length = 20) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*'
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(bytes, (b) => chars[b % chars.length]).join('')
}

export default function PasswordVault() {
  const [masterPassword, setMasterPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [entries, setEntries] = useState<VaultEntry[]>([])
  const [error, setError] = useState('')
  const [visibleId, setVisibleId] = useState<string | null>(null)
  const [draft, setDraft] = useState({ site: '', username: '', password: '' })

  const hasStoredVault = !!localStorage.getItem(VAULT_STORAGE_KEY)

  const persist = async (next: VaultEntry[], password: string) => {
    const blob = await encryptVault(password, next)
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(blob))
    setEntries(next)
  }

  const unlock = async () => {
    setError('')
    const raw = localStorage.getItem(VAULT_STORAGE_KEY)
    try {
      if (!raw) {
        setEntries([])
        setUnlocked(true)
        return
      }
      const blob = JSON.parse(raw) as EncryptedBlob
      const data = await decryptVault<VaultEntry[]>(masterPassword, blob)
      setEntries(data)
      setUnlocked(true)
    } catch {
      setError('Wrong master password, or the vault is corrupted.')
    }
  }

  const addEntry = async () => {
    if (!draft.site || !draft.password) return
    const next = [...entries, { id: crypto.randomUUID(), ...draft }]
    await persist(next, masterPassword)
    setDraft({ site: '', username: '', password: '' })
  }

  const removeEntry = async (id: string) => {
    const next = entries.filter((e) => e.id !== id)
    await persist(next, masterPassword)
  }

  return (
    <ToolLayout index={meta.index} title={meta.name} description={meta.tagline}>
      {!unlocked ? (
        <div className="mx-auto max-w-sm text-center">
          <Lock className="mx-auto h-8 w-8 text-cyan" strokeWidth={1.5} />
          <p className="mt-4 text-sm text-mist">
            {hasStoredVault
              ? 'Enter your master password to decrypt your vault.'
              : 'Create a master password. Forget it, and your vault cannot be recovered — by design.'}
          </p>
          <input
            type="password"
            value={masterPassword}
            onChange={(e) => setMasterPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && unlock()}
            placeholder="Master password"
            className="mt-6 w-full rounded-xl border border-line bg-ink px-4 py-3 text-center text-sm outline-none focus:border-cyan"
          />
          {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
          <button
            onClick={unlock}
            disabled={!masterPassword}
            data-cursor="Unlock"
            className="font-mono-tag mt-6 inline-flex items-center gap-2 rounded-full border border-cyan px-6 py-3 text-xs uppercase tracking-widest text-cyan transition-colors hover:bg-cyan hover:text-ink disabled:opacity-40"
          >
            <Unlock className="h-3.5 w-3.5" /> Unlock Vault
          </button>
        </div>
      ) : (
        <div>
          <div className="grid gap-3 border-b border-line pb-6 md:grid-cols-[1fr_1fr_1fr_auto]">
            <input
              value={draft.site}
              onChange={(e) => setDraft((d) => ({ ...d, site: e.target.value }))}
              placeholder="Site / app"
              className="rounded-lg border border-line bg-ink px-3 py-2 text-sm outline-none focus:border-cyan"
            />
            <input
              value={draft.username}
              onChange={(e) => setDraft((d) => ({ ...d, username: e.target.value }))}
              placeholder="Username"
              className="rounded-lg border border-line bg-ink px-3 py-2 text-sm outline-none focus:border-cyan"
            />
            <div className="flex gap-2">
              <input
                value={draft.password}
                onChange={(e) => setDraft((d) => ({ ...d, password: e.target.value }))}
                placeholder="Password"
                className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm outline-none focus:border-cyan"
              />
              <button
                type="button"
                onClick={() => setDraft((d) => ({ ...d, password: genPassword() }))}
                data-cursor="Generate"
                className="font-mono-tag whitespace-nowrap rounded-lg border border-line px-3 text-[10px] uppercase text-mist hover:border-cyan hover:text-cyan"
              >
                Generate
              </button>
            </div>
            <button
              onClick={addEntry}
              data-cursor="Add"
              className="font-mono-tag inline-flex items-center justify-center gap-1 rounded-lg border border-cyan px-4 text-xs uppercase text-cyan hover:bg-cyan hover:text-ink"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <ul className="mt-6 space-y-2">
            {entries.length === 0 && (
              <p className="py-6 text-center text-sm text-mist">No entries yet.</p>
            )}
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{entry.site}</p>
                  <p className="truncate text-xs text-mist">{entry.username}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono-tag text-sm">
                    {visibleId === entry.id ? entry.password : '•'.repeat(10)}
                  </span>
                  <button
                    onClick={() => setVisibleId(visibleId === entry.id ? null : entry.id)}
                    className="text-mist hover:text-cyan"
                  >
                    {visibleId === entry.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button onClick={() => removeEntry(entry.id)} className="text-mist hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ToolLayout>
  )
}
