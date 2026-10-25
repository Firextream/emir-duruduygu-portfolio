// /keystatic — its own root layout, apart from the skins. Never indexed: noindex here, an
// X-Robots-Tag header (middleware + next.config) and a robots.txt Disallow. In production the
// middleware lets nobody in without a GitHub login (KEYSTATIC.md).
import type { Metadata } from 'next'
import KeystaticApp from './keystatic'

export const metadata: Metadata = {
  title: 'Keystatic · duruduygu.com',
  robots: { index: false, follow: false, nocache: true },
}

export default function KeystaticLayout() {
  return (
    <html lang="en">
      <body>
        <KeystaticApp />
      </body>
    </html>
  )
}
