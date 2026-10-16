// Soft Club: Unbounded 300 (lowercase display), Zen Kaku Gothic New (body + Japanese), Doto 700 (numbers).
// `subsets` only decides what is preloaded; latin-ext glyphs (İ, ş, ğ) still load on demand via unicode-range.
import { Doto, Unbounded, Zen_Kaku_Gothic_New } from 'next/font/google'

const display = Unbounded({ subsets: ['latin'], weight: '300', variable: '--font-display', display: 'swap' })
const body = Zen_Kaku_Gothic_New({ subsets: ['latin'], weight: ['400', '500', '700', '900'], variable: '--font-body', display: 'swap' })
const num = Doto({ subsets: ['latin'], weight: '700', variable: '--font-num', display: 'swap' })

export const softFonts = [display, body, num].map((f) => f.variable).join(' ')
