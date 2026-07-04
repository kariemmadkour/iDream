export interface ToolMeta {
  index: string
  slug: string
  name: string
  tagline: string
  tags: string[]
}

export const TOOLS: ToolMeta[] = [
  {
    index: '01',
    slug: 'qr-generator',
    name: 'QR Generator',
    tagline: 'Turn any link or text into a scannable QR code, instantly.',
    tags: ['Client-side', 'PNG / SVG'],
  },
  {
    index: '02',
    slug: 'password-vault',
    name: 'Password Vault',
    tagline: 'A zero-knowledge vault encrypted in your browser — nothing ever leaves your device.',
    tags: ['AES-256-GCM', 'Local only'],
  },
  {
    index: '03',
    slug: 'unit-converter',
    name: 'Unit Converter',
    tagline: 'Length, mass, volume, area, speed, data and time — one converter.',
    tags: ['8 categories', 'Real-time'],
  },
  {
    index: '04',
    slug: 'json-toolkit',
    name: 'JSON Toolkit',
    tagline: 'Format, minify and validate JSON with clear, inline error reporting.',
    tags: ['Format', 'Validate'],
  },
  {
    index: '05',
    slug: 'hash-generator',
    name: 'Hash Generator',
    tagline: 'Generate MD5, SHA-1, SHA-256, SHA-384 and SHA-512 digests from any text.',
    tags: ['MD5', 'SHA-2'],
  },
  {
    index: '06',
    slug: 'cv-maker',
    name: 'CV Maker',
    tagline: 'Build a clean, print-ready resume with a live preview as you type.',
    tags: ['Live preview', 'PDF export'],
  },
]
