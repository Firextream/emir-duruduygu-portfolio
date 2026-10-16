// Root layout of the Soft Club skin. middleware.ts rewrites public URLs here from the 'duru-skin' cookie.
import '@/styles/base.css'
import '@/styles/skins/soft.css'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import SkinDocument from '@/components/site/SkinDocument'
import SoftFrame from '@/components/skins/soft/SoftFrame'
import { softFonts } from '@/lib/fonts/soft'
import { siteMetadata } from '@/lib/routes/meta'

export const metadata: Metadata = siteMetadata
export const viewport: Viewport = { themeColor: '#eef2f6', colorScheme: 'light' }

export default function SoftLayout({ children }: { children: ReactNode }) {
  return (
    <SkinDocument skin="soft" fonts={softFonts}>
      <SoftFrame>{children}</SoftFrame>
    </SkinDocument>
  )
}
