// Zero-knowledge client-side vault crypto. The master password never leaves
// the browser and nothing is ever sent to a server — encryption happens
// entirely via the Web Crypto API against a key derived with PBKDF2.

const PBKDF2_ITERATIONS = 250_000

function toBase64(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  let binary = ''
  for (const b of arr) binary += String.fromCharCode(b)
  return btoa(binary)
}

function fromBase64(b64: string): Uint8Array {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export interface EncryptedBlob {
  salt: string
  iv: string
  ciphertext: string
}

export async function encryptVault(password: string, data: unknown): Promise<EncryptedBlob> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(password, salt)
  const enc = new TextEncoder()
  const plaintext = enc.encode(JSON.stringify(data))
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv as BufferSource }, key, plaintext)
  return { salt: toBase64(salt), iv: toBase64(iv), ciphertext: toBase64(ciphertext) }
}

export async function decryptVault<T>(password: string, blob: EncryptedBlob): Promise<T> {
  const salt = fromBase64(blob.salt)
  const iv = fromBase64(blob.iv)
  const key = await deriveKey(password, salt)
  const ciphertext = fromBase64(blob.ciphertext)
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv as BufferSource }, key, ciphertext as BufferSource)
  const dec = new TextDecoder()
  return JSON.parse(dec.decode(plaintext)) as T
}

export interface VaultEntry {
  id: string
  site: string
  username: string
  password: string
  notes?: string
}

export const VAULT_STORAGE_KEY = 'idream:vault:v1'
