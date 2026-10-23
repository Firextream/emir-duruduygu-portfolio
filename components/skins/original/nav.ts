// Original's numbered nav (README "Original": Portfolio and Moodboard dropped from the live nav).
// Blog is the journal (/blog); Contact is the form on About (/about#contact).
import type { Section } from '@/lib/skins'

export interface OriginalNavItem {
  no: string
  label: string
  href: string
  section: Section | null
  hash?: boolean
}

export const ORIGINAL_NAV: OriginalNavItem[] = [
  { no: '01', label: 'Lab', href: '/lab', section: 'lab' },
  { no: '02', label: 'Gallery', href: '/gallery', section: 'gallery' },
  { no: '03', label: 'Blog', href: '/blog', section: 'journal' },
  { no: '04', label: 'About', href: '/about', section: 'about' },
  { no: '05', label: 'Contact', href: '/about#contact', section: 'about', hash: true },
]

/** The mobile dock: Home first, then the sections in reading order, keeping their numbers. */
export const ORIGINAL_DOCK: { no: string; label: string; section: Section }[] = [
  { no: '00', label: 'Home', section: 'home' },
  { no: '02', label: 'Gallery', section: 'gallery' },
  { no: '03', label: 'Blog', section: 'journal' },
  { no: '01', label: 'Lab', section: 'lab' },
  { no: '04', label: 'About', section: 'about' },
]
