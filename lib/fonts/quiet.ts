// Quiet: Cormorant Garamond (display, italic), Pixelify Sans (labels), IBM Plex Sans (body),
// IBM Plex Mono (meta), Doto 900 (LCD digits). Only the weights the references use.
// `subsets` only decides what is preloaded; latin-ext glyphs (İ, ş, ğ) still load on demand via unicode-range.
import { Cormorant_Garamond, Doto, IBM_Plex_Mono, IBM_Plex_Sans, Pixelify_Sans } from 'next/font/google'

const serif = Cormorant_Garamond({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' })
const pixel = Pixelify_Sans({ subsets: ['latin'], weight: '400', variable: '--font-pixel', display: 'swap' })
const sans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-sans', display: 'swap' })
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: '400', variable: '--font-mono', display: 'swap', preload: false })
const lcd = Doto({ subsets: ['latin'], weight: '900', variable: '--font-lcd', display: 'swap', preload: false })

export const quietFonts = [serif, pixel, sans, mono, lcd].map((f) => f.variable).join(' ')
