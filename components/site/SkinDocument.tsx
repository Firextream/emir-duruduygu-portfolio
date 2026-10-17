// The <html> shell every skin layout renders: skin + font classes, the pre-paint script, the
// arrival curtain (first in <body> so it paints before anything else) and the StyleProvider.
import type { ReactNode } from 'react'
import { curtainFonts } from '@/lib/fonts/curtain'
import { PREPAINT_SCRIPT } from '@/lib/prepaint'
import { personJsonLd } from '@/lib/routes/meta'
import type { Skin } from '@/lib/skins'
import SkinCurtain from './SkinCurtain'
import StyleProvider from './StyleProvider'

export default function SkinDocument({ skin, fonts, children }: { skin: Skin; fonts: string; children: ReactNode }) {
  return (
    // data-acc / data-switching are set by the pre-paint script before hydration.
    <html lang="en" data-skin={skin} data-acc="0" className={`${fonts} ${curtainFonts}`} suppressHydrationWarning>
      {/* App Router root layout: <head> is correct here (the rule targets the pages router) */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREPAINT_SCRIPT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </head>
      <body>
        <SkinCurtain skin={skin} variant="arrive" />
        <StyleProvider skin={skin}>{children}</StyleProvider>
      </body>
    </html>
  )
}
