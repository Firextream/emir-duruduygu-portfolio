// Soft Club: Unbounded 300 (lowercase display), Zen Kaku Gothic New (body + Japanese), Doto 700 (numbers).
// Zen Kaku is a self-hosted subset (see zen-kaku/README.md): the Google version's ~120 CJK slices per
// weight made the CSS render-blocking. It is not preloaded; text paints in the fallback and swaps.
import { Doto, Unbounded } from 'next/font/google'
import localFont from 'next/font/local'

const display = Unbounded({ subsets: ['latin'], weight: '300', variable: '--font-display', display: 'swap' })
const body = localFont({
  src: [
    { path: './zen-kaku/zen-kaku-gothic-new-400.woff2', weight: '400', style: 'normal' },
    { path: './zen-kaku/zen-kaku-gothic-new-500.woff2', weight: '500', style: 'normal' },
    { path: './zen-kaku/zen-kaku-gothic-new-700.woff2', weight: '700', style: 'normal' },
    { path: './zen-kaku/zen-kaku-gothic-new-900.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
  preload: false,
  fallback: ['Hiragino Sans', 'Yu Gothic', 'system-ui', 'sans-serif'],
})
const num = Doto({ subsets: ['latin'], weight: '700', variable: '--font-num', display: 'swap', preload: false })

export const softFonts = [display, body, num].map((f) => f.variable).join(' ')
