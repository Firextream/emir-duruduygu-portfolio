// Skin ids, persistence keys and per-skin chrome data shared by the server and the client.
import type { Skin } from './content/types'

export type { Skin }

export const SKINS: Skin[] = ['quiet', 'soft', 'modern']

/** localStorage — the source of truth for the visitor's choice: { skin, acc } */
export const STORAGE_KEY = 'duru-style-v2'
/** Cookie mirror of the skin so the server can render the right tree (set by middleware + StyleProvider). */
export const SKIN_COOKIE = 'duru-skin'
/** sessionStorage flag: a skin switch is in progress, show the new skin's curtain on first paint. */
export const SWITCH_FLAG = 'duru-skin-switch'

export const isSkin = (v: unknown): v is Skin => v === 'quiet' || v === 'soft' || v === 'modern'

export const SKIN_INFO: Record<Skin, { label: string }> = {
  quiet: { label: 'Quiet' },
  soft: { label: 'Soft Club' },
  modern: { label: 'Modernist' },
}

/** Quiet is the only skin with more than one accent. */
export const QUIET_ACCENTS = [
  { name: 'Umber', value: '#8a5a3c' },
  { name: 'Sage', value: '#55704e' },
  { name: 'Slate', value: '#46617f' },
  { name: 'Plum', value: '#7a4b64' },
] as const

export const ACCENT_COUNT: Record<Skin, number> = { quiet: QUIET_ACCENTS.length, soft: 1, modern: 1 }

export type Section = 'home' | 'gallery' | 'journal' | 'about' | 'lab'

export const SECTION_HREF: Record<Section, string> = {
  home: '/',
  gallery: '/gallery',
  journal: '/blog',
  about: '/about',
  lab: '/lab',
}

export type PageKey = 'home' | 'gallery' | 'photo' | 'journal' | 'post' | 'about' | 'lab' | 'project' | 'nf'

/**
 * Pathname → page key. Strips an internal /quiet|/soft|/modern prefix so server renders of the
 * rewritten route and client renders of the public URL agree (no hydration mismatch).
 */
export function pageOf(pathname: string | null): PageKey {
  const parts = (pathname ?? '/').split('/').filter(Boolean)
  if (isSkin(parts[0])) parts.shift()
  const [a, b, c] = parts
  if (!a) return 'home'
  if (a === 'gallery') return !b ? 'gallery' : !c ? 'photo' : 'nf'
  if (a === 'blog') return !b ? 'journal' : !c ? 'post' : 'nf'
  if (a === 'lab') return !b ? 'lab' : !c ? 'project' : 'nf'
  if (a === 'about' && !b) return 'about'
  return 'nf'
}

export const SECTION_OF_PAGE: Record<PageKey, Section | null> = {
  home: 'home',
  gallery: 'gallery',
  photo: 'gallery',
  journal: 'journal',
  post: 'journal',
  about: 'about',
  lab: 'lab',
  project: 'lab',
  nf: null,
}
