// Data and metadata for /about in every skin.
import type { Metadata } from 'next'
import { getAbout, getPosts, getProjects, getSettings } from '@/lib/content'

export async function getAboutData() {
  const [about, settings, projects, posts] = await Promise.all([getAbout(), getSettings(), getProjects(), getPosts()])
  const building = projects[0] ?? null
  const latest = posts[0] ?? null
  return {
    about,
    email: settings.email,
    links: settings.links,
    // Soft Club "now": what is being built and the newest entry
    building: building ? { name: building.name, status: building.status, href: `/lab/${building.slug}` } : null,
    latest: latest ? { title: latest.title, href: `/blog/${latest.slug}` } : null,
  }
}

export type AboutData = Awaited<ReturnType<typeof getAboutData>>

export const aboutMetadata: Metadata = {
  title: 'About',
  description: 'Emir Duruduygu, an electrical and electronics engineering student at İTÜ in Istanbul. Photographs, small hardware and clothes cut to measure.',
  alternates: { canonical: '/about' },
}
