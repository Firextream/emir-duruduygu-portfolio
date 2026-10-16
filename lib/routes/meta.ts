// Site-wide metadata shared by the three skin layouts.
import type { Metadata } from 'next'
import { SITE_LINKS } from '@/lib/content/links'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.duruduygu.com').replace(/\/+$/, '')

export const SITE_DESCRIPTION =
  "Emir Duruduygu's personal site: photographs of Istanbul, a journal, and a small lab for hardware and clothes cut to measure."

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Duruduygu', template: '%s — Duruduygu' },
  description: SITE_DESCRIPTION,
  applicationName: 'Duruduygu',
  authors: [{ name: 'Emir Duruduygu', url: SITE_URL }],
  alternates: { canonical: '/', types: { 'application/rss+xml': '/feed.xml' } },
  openGraph: { type: 'website', siteName: 'Duruduygu', locale: 'en_US', url: '/' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Emir Duruduygu',
  url: SITE_URL,
  sameAs: SITE_LINKS.filter((l) => l.href.startsWith('http')).map((l) => l.href),
}
