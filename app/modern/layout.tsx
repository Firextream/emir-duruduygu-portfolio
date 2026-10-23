// Root layout of the Modernist skin. middleware.ts rewrites public URLs here from the 'duru-skin' cookie.
import '@/styles/base.css'
import '@/styles/skins/modern.css'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import SkinDocument from '@/components/site/SkinDocument'
import ModernFrame from '@/components/skins/modern/ModernFrame'
import { modernFonts } from '@/lib/fonts/modern'
import { siteMetadata } from '@/lib/routes/meta'
import { skinDef } from '@/lib/skins'

export const metadata: Metadata = siteMetadata
export const viewport: Viewport = { themeColor: skinDef('modern').themeColor, colorScheme: 'light' }

export default function ModernLayout({ children }: { children: ReactNode }) {
  return (
    <SkinDocument skin="modern" fonts={modernFonts}>
      <ModernFrame>{children}</ModernFrame>
    </SkinDocument>
  )
}
