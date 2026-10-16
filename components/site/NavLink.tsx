'use client'

// A nav/dock link that marks itself aria-current="page" when its section is active.
// Skins style the active state through [aria-current='page'].
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { pageOf, SECTION_HREF, SECTION_OF_PAGE, type Section } from '@/lib/skins'

export function useSection(): Section | null {
  return SECTION_OF_PAGE[pageOf(usePathname())]
}

export default function NavLink({
  section,
  className,
  children,
  onNavigate,
}: {
  section: Section
  className?: string
  children: ReactNode
  onNavigate?: () => void
}) {
  const active = useSection() === section
  return (
    <Link href={SECTION_HREF[section]} className={className} aria-current={active ? 'page' : undefined} onClick={onNavigate}>
      {children}
    </Link>
  )
}
