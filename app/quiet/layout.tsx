// Root layout of the Quiet skin. middleware.ts rewrites public URLs here from the 'duru-skin' cookie.
import '@/styles/base.css'
import '@/styles/skins/quiet.css'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import SkinDocument from '@/components/site/SkinDocument'
import QuietFrame from '@/components/skins/quiet/QuietFrame'
import { quietFonts } from '@/lib/fonts/quiet'
import { siteMetadata } from '@/lib/routes/meta'
import { skinDef } from '@/lib/skins'

export const metadata: Metadata = siteMetadata
export const viewport: Viewport = { themeColor: skinDef('quiet').themeColor, colorScheme: 'light' }

export default function QuietLayout({ children }: { children: ReactNode }) {
  return (
    <SkinDocument skin="quiet" fonts={quietFonts}>
      <QuietFrame>{children}</QuietFrame>
    </SkinDocument>
  )
}
