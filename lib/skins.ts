// The skin registry: the one place that lists the skins. Everything shared reads from here —
// middleware (random pick + rewrite), the pre-paint script, StyleProvider (accents), the style
// menus (labels + swatches), the skin-change curtain and the per-skin home photo (settings).
//
// Adding a skin = one entry below, plus the skin itself: its route tree app/<id>/ (root layout +
// the same routes as app/quiet), its Frame and pages in components/skins/<id>/, tokens in
// styles/skins/<id>.css and fonts in lib/fonts/<id>.ts. In Directus, settings.home_photo_<id>
// picks its home photo (optional — the first photo is used otherwise).
// Edge-safe: imported by middleware.ts, so keep this file free of heavy imports.

export interface SkinAccent {
  name: string
  value: string
}

export interface SkinDef {
  label: string
  /** CSS background for the swatch in the style menus */
  swatch: string
  /** browser UI colour (viewport themeColor) */
  themeColor: string
  /** extra accents the visitor can pick (index 0 = default); one entry = no accent row */
  accents: readonly SkinAccent[]
  /** the full-screen curtain shown while switching to this skin */
  curtain: {
    line: string
    name: string
    bg: string
    ink: string
    fill: string
    /** font-family stacks; prefer the skin's next/font var, then a preload:false curtain font */
    ui: string
    display: string
    weight: number
    style?: 'italic'
    track: string
    ease: string
    round?: string
    /** how the curtain enters: fade-up, or a clip-path wipe from the left */
    enter: 'rise' | 'wipe'
  }
}

export const SKIN_REGISTRY = {
  quiet: {
    label: 'Quiet',
    swatch: 'linear-gradient(135deg, #e4ebee 50%, #8a5a3c 50%)',
    themeColor: '#e4ebee',
    accents: [
      { name: 'Umber', value: '#8a5a3c' },
      { name: 'Sage', value: '#55704e' },
      { name: 'Slate', value: '#46617f' },
      { name: 'Plum', value: '#7a4b64' },
    ],
    curtain: {
      line: '~/style.cfg — mounting windows',
      name: 'Quiet',
      bg: '#e4ebee',
      ink: '#2a2b2c',
      fill: '#8a5a3c',
      ui: "var(--font-pixel, var(--curtain-quiet-ui)), 'Pixelify Sans', monospace",
      display: "var(--font-serif, var(--curtain-quiet)), 'Cormorant Garamond', serif",
      weight: 400,
      style: 'italic',
      track: '-0.02em',
      ease: 'steps(12)',
      enter: 'rise',
    },
  },
  soft: {
    label: 'Soft Club',
    swatch: 'radial-gradient(circle at 35% 30%, #ffffff 0 20%, #1a9dff 75%, #0b3a6b)',
    themeColor: '#eef2f6',
    accents: [{ name: 'Aqua', value: '#1a9dff' }],
    curtain: {
      line: '読み込み中 · LOADING MODEL DD-01',
      name: 'soft club',
      bg: 'radial-gradient(50% 40% at 80% 10%, rgba(26, 157, 255, 0.35), transparent 70%), linear-gradient(180deg, #f5f8fb, #dbe4ee)',
      ink: '#162033',
      fill: '#1a9dff',
      ui: "var(--font-body, sans-serif), 'Zen Kaku Gothic New', 'Hiragino Sans', 'Yu Gothic', sans-serif",
      display: "var(--font-display, var(--curtain-soft)), 'Unbounded', sans-serif",
      weight: 300,
      track: '-0.02em',
      ease: 'cubic-bezier(0.6, 0, 0.2, 1)',
      round: '999px',
      enter: 'rise',
    },
  },
  modern: {
    label: 'Modernist',
    swatch: 'linear-gradient(135deg, #f3f2f2 50%, #ec3013 50%)',
    themeColor: '#f3f2f2',
    accents: [{ name: 'Signal red', value: '#ec3013' }],
    curtain: {
      line: 'SETTING THE GRID',
      name: 'Modernist',
      bg: '#ec3013',
      ink: '#ffffff',
      fill: '#ffffff',
      ui: "var(--font-archivo, var(--curtain-modern)), 'Archivo', sans-serif",
      display: "var(--font-archivo, var(--curtain-modern)), 'Archivo', sans-serif",
      weight: 800,
      track: '-0.05em',
      ease: 'linear',
      enter: 'wipe',
    },
  },
} as const satisfies Record<string, SkinDef>

export type Skin = keyof typeof SKIN_REGISTRY

export const SKINS = Object.keys(SKIN_REGISTRY) as Skin[]

export const isSkin = (v: unknown): v is Skin => typeof v === 'string' && Object.prototype.hasOwnProperty.call(SKIN_REGISTRY, v)

export const skinDef = (skin: Skin): SkinDef => SKIN_REGISTRY[skin]

/** Stored values from earlier versions of the switcher → today's skins. */
export const LEGACY_SKINS: Record<string, Skin> = { metal: 'soft', film: 'soft' }

/** localStorage — the source of truth for the visitor's choice: { skin, acc } */
export const STORAGE_KEY = 'duru-style-v2'
/** Cookie mirror of the skin so the server can render the right tree (set by middleware + StyleProvider). */
export const SKIN_COOKIE = 'duru-skin'
/** sessionStorage flag: a skin switch is in progress, show the new skin's curtain on first paint. */
export const SWITCH_FLAG = 'duru-skin-switch'

export const SKIN_INFO = SKIN_REGISTRY

export const QUIET_ACCENTS = SKIN_REGISTRY.quiet.accents

export const ACCENT_COUNT = Object.fromEntries(SKINS.map((k) => [k, SKIN_REGISTRY[k].accents.length])) as Record<Skin, number>

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
 * Pathname → page key. Strips an internal /<skin> prefix so server renders of the rewritten
 * route and client renders of the public URL agree (no hydration mismatch).
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
