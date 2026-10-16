'use client'

// The mobile sub-header crumb ("~/pictures / viewer", "Gallery / Photograph", …) for the current page.
import { usePathname } from 'next/navigation'
import { pageOf, type PageKey } from '@/lib/skins'

export default function Crumb({ labels, className }: { labels: Record<PageKey, string>; className?: string }) {
  return <span className={className}>{labels[pageOf(usePathname())]}</span>
}
