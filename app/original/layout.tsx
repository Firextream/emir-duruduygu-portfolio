// Root layout of the Original skin. middleware.ts rewrites public URLs here from the 'duru-skin' cookie.
import '@/styles/base.css'
import '@/styles/skins/original.css'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import SkinDocument from '@/components/site/SkinDocument'
import OriginalFrame from '@/components/skins/original/OriginalFrame'
import { originalFonts } from '@/lib/fonts/original'
import { siteMetadata } from '@/lib/routes/meta'
import { skinDef } from '@/lib/skins'

export const metadata: Metadata = siteMetadata
export const viewport: Viewport = { themeColor: skinDef('original').themeColor, colorScheme: 'light' }

export default function OriginalLayout({ children }: { children: ReactNode }) {
  return (
    <SkinDocument skin="original" fonts={originalFonts}>
      <OriginalFrame>{children}</OriginalFrame>
    </SkinDocument>
  )
}
