// Original: Playfair Display 400 + italic (display), Inter 400 / 500 (body), JetBrains Mono 400 / 500
// (numbers, kickers) — the live site's faces (README "Original tokens").
// The variable names are Original's own, so a curtain on another skin never picks up the wrong face.
import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-playfair', display: 'swap' })
const inter = Inter({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-inter', display: 'swap' })
// The mono fallback is Courier New, not next/font's size-adjusted Arial: both advance 0.6em per character, so
// a kicker keeps its line count when JetBrains Mono swaps in (Arial wrapped the mobile hero kicker: CLS)
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jbmono', display: 'swap', fallback: ['Courier New', 'monospace'], adjustFontFallback: false })

export const originalFonts = [playfair, inter, mono].map((f) => f.variable).join(' ')
