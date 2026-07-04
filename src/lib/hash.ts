// MD5 implementation (public-domain style, RFC 1321) — the Web Crypto API
// intentionally does not expose MD5, so it's the one algorithm we compute by hand.
function md5(input: string): string {
  const rotateLeft = (x: number, c: number) => (x << c) | (x >>> (32 - c))
  const toUtf8Bytes = (str: string) => new TextEncoder().encode(str)

  const K = new Int32Array([
    -680876936, -389564586, 606105819, -1044525330, -176418897, 1200080426, -1473231341, -45705983,
    1770035416, -1958414417, -42063, -1990404162, 1804603682, -40341101, -1502002290, 1236535329,
    -165796510, -1069501632, 643717713, -373897302, -701558691, 38016083, -660478335, -405537848,
    568446438, -1019803690, -187363961, 1163531501, -1444681467, -51403784, 1735328473, -1926607734,
    -378558, -2022574463, 1839030562, -35309556, -1530992060, 1272893353, -155497632, -1094730640,
    681279174, -358537222, -722521979, 76029189, -640364487, -421815835, 530742520, -995338651,
    -198630844, 1126891415, -1416354905, -57434055, 1700485571, -1894986606, -1051523, -2054922799,
    1873313359, -30611744, -1560198380, 1309151649, -145523070, -1120210379, 718787259, -343485551,
  ])
  const S = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21]

  const bytes = toUtf8Bytes(input)
  const bitLen = bytes.length * 8
  const withOne = new Uint8Array(((bytes.length + 8) >> 6) * 64 + 64)
  withOne.set(bytes)
  withOne[bytes.length] = 0x80
  const view = new DataView(withOne.buffer)
  view.setUint32(withOne.length - 8, bitLen >>> 0, true)
  view.setUint32(withOne.length - 4, Math.floor(bitLen / 2 ** 32), true)

  let a0 = 0x67452301, b0 = -0x10325477, c0 = -0x67452302, d0 = 0x10325476

  for (let chunkStart = 0; chunkStart < withOne.length; chunkStart += 64) {
    const M = new Int32Array(16)
    for (let i = 0; i < 16; i++) M[i] = view.getInt32(chunkStart + i * 4, true)

    let [A, B, C, D] = [a0, b0, c0, d0]
    for (let i = 0; i < 64; i++) {
      let F = 0, g = 0
      if (i < 16) { F = (B & C) | (~B & D); g = i }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16 }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16 }
      else { F = C ^ (B | ~D); g = (7 * i) % 16 }
      F = (F + A + K[i] + M[g]) | 0
      A = D; D = C; C = B
      B = (B + rotateLeft(F, S[i])) | 0
    }
    a0 = (a0 + A) | 0; b0 = (b0 + B) | 0; c0 = (c0 + C) | 0; d0 = (d0 + D) | 0
  }

  const toHex = (n: number) => {
    const bytes4 = new Uint8Array(4)
    new DataView(bytes4.buffer).setInt32(0, n, true)
    return Array.from(bytes4).map((b) => b.toString(16).padStart(2, '0')).join('')
  }
  return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0)
}

export type HashAlgo = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'

export async function computeHash(algo: HashAlgo, input: string): Promise<string> {
  if (algo === 'MD5') return md5(input)
  const bytes = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest(algo, bytes)
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export const HASH_ALGOS: HashAlgo[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']
