// Small helpers shared by the content adapters.

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a)

/** 1440×960 → "3:2" */
export function ratio(w: number, h: number): string {
  if (!w || !h) return '1:1'
  const k = gcd(Math.round(w), Math.round(h)) || 1
  return `${Math.round(w) / k}:${Math.round(h) / k}`
}

/** "02:14" or "1:02:14" → seconds; null for placeholders like "[mm:ss]" */
export function toSeconds(time: string): number | null {
  if (!/^\d{1,2}(:\d{2}){1,2}$/.test(time.trim())) return null
  return time
    .trim()
    .split(':')
    .reduce((acc, part) => acc * 60 + Number(part), 0)
}

/** "2026-03-14" (Directus) → "14.03.2026"; anything else passes through */
export function displayDate(value: string | null | undefined): string {
  if (!value) return ''
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  return m ? `${m[3]}.${m[2]}.${m[1]}` : value
}

/** "2026-03-14" → "2026.03.14" (design-log style) */
export function logDate(value: string | null | undefined): string {
  if (!value) return ''
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  return m ? `${m[1]}.${m[2]}.${m[3]}` : value
}
