// Display faces for the skin-change curtain when it shows a *different* skin than the page's own.
// preload:false — the files only download when the style menu opens (see SkinCurtain).
import { Archivo, Cormorant_Garamond, JetBrains_Mono, Pixelify_Sans, Playfair_Display, Unbounded } from 'next/font/google'

const quiet = Cormorant_Garamond({ subsets: ['latin'], weight: '400', style: 'italic', variable: '--curtain-quiet', preload: false })
const quietUi = Pixelify_Sans({ subsets: ['latin'], weight: '400', variable: '--curtain-quiet-ui', preload: false })
const soft = Unbounded({ subsets: ['latin'], weight: '300', variable: '--curtain-soft', preload: false })
const modern = Archivo({ subsets: ['latin'], weight: ['400', '800'], variable: '--curtain-modern', preload: false })

const original = Playfair_Display({ subsets: ['latin'], weight: '400', variable: '--curtain-original', preload: false })
const originalUi = JetBrains_Mono({ subsets: ['latin'], weight: '400', variable: '--curtain-original-ui', preload: false })

export const curtainFonts = [quiet, quietUi, soft, modern, original, originalUi].map((f) => f.variable).join(' ')
