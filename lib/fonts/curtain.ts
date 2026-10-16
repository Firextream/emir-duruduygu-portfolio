// Display faces for the skin-change curtain when it shows a *different* skin than the page's own.
// preload:false — the files only download when the style menu opens (see SkinCurtain).
import { Archivo, Cormorant_Garamond, Pixelify_Sans, Unbounded } from 'next/font/google'

const quiet = Cormorant_Garamond({ subsets: ['latin'], weight: '400', style: 'italic', variable: '--curtain-quiet', preload: false })
const quietUi = Pixelify_Sans({ subsets: ['latin'], weight: '400', variable: '--curtain-quiet-ui', preload: false })
const soft = Unbounded({ subsets: ['latin'], weight: '300', variable: '--curtain-soft', preload: false })
const modern = Archivo({ subsets: ['latin'], weight: ['400', '800'], variable: '--curtain-modern', preload: false })

export const curtainFonts = [quiet, quietUi, soft, modern].map((f) => f.variable).join(' ')
