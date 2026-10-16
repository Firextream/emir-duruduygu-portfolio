// Modernist: Archivo 400 / 600 / 800 only (README + Modernist design system).
// `subsets` only decides what is preloaded; latin-ext glyphs (İ, ş, ğ) still load on demand via unicode-range.
import { Archivo } from 'next/font/google'

const archivo = Archivo({ subsets: ['latin'], weight: ['400', '600', '800'], variable: '--font-archivo', display: 'swap' })

export const modernFonts = archivo.variable
