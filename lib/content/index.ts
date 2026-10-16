// The one data interface for the site. Pick the source with CONTENT_SOURCE=mock|directus.
// Pages and components import from here only — never from an adapter, and never from lib/notion*.
import 'server-only'
import { cache } from 'react'
import { directusAdapter } from './directus'
import { SITE_EMAIL, SITE_LINKS } from './links'
import { mockAdapter } from './mock'
import type { ContentAdapter, LabNote, Mood, Photo, Post, Project, Settings, Skin } from './types'

export type * from './types'

export type ContentSource = 'mock' | 'directus'

export function contentSource(): ContentSource {
  return process.env.CONTENT_SOURCE === 'directus' ? 'directus' : 'mock'
}

const adapter = (): ContentAdapter => (contentSource() === 'directus' ? directusAdapter : mockAdapter)

/** A failing CMS must not take the site down: log it and render empty states instead. */
async function safely<T>(label: string, run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run()
  } catch (error) {
    console.error(`[content] ${contentSource()} ${label} failed:`, error instanceof Error ? error.message : error)
    return fallback
  }
}

export const getPhotos = cache((): Promise<Photo[]> => safely('photos', () => adapter().photos(), []))
export const getMood = cache((): Promise<Mood[]> => safely('mood', () => adapter().mood(), []))
export const getPosts = cache((): Promise<Post[]> => safely('posts', () => adapter().posts(), []))
export const getProjects = cache((): Promise<Project[]> => safely('projects', () => adapter().projects(), []))
export const getSettings = cache(
  (): Promise<Settings> =>
    safely('settings', () => adapter().settings(), {
      homePhoto: { quiet: null, modern: null, soft: null },
      email: SITE_EMAIL,
      links: SITE_LINKS,
    }),
)

export interface Sequenced<T> {
  item: T
  index: number
  prev: T
  next: T
  total: number
}

function sequence<T>(list: T[], index: number): Sequenced<T> | null {
  if (index < 0) return null
  const n = list.length
  return { item: list[index], index, prev: list[(index - 1 + n) % n], next: list[(index + 1) % n], total: n }
}

export async function getPhoto(id: string) {
  const photos = await getPhotos()
  return sequence(photos, photos.findIndex((p) => p.id === id))
}

export async function getPost(slug: string) {
  const posts = await getPosts()
  return sequence(posts, posts.findIndex((p) => p.slug === slug))
}

export async function getProject(slug: string) {
  const projects = await getProjects()
  return sequence(projects, projects.findIndex((p) => p.slug === slug))
}

/** Latest design-log entries across every project (Lab → "01 Lab notes"). */
export async function getLabNotes(limit = 6): Promise<LabNote[]> {
  const projects = await getProjects()
  const notes = projects.flatMap((p) => p.log.map((l) => ({ ...l, project: p.name, slug: p.slug })))
  const dated = notes.every((n) => /^\d{4}[.-]\d{2}[.-]\d{2}$/.test(n.date))
  if (dated) notes.sort((a, b) => b.date.localeCompare(a.date))
  else {
    // placeholder dates can't be sorted — interleave so every project shows up
    const byProject = projects.map((p) => notes.filter((n) => n.slug === p.slug))
    notes.length = 0
    for (let i = 0; byProject.some((l) => l[i]); i++) byProject.forEach((l) => l[i] && notes.push(l[i]))
  }
  return notes.slice(0, limit)
}

/** The admin-picked home photo for a skin; falls back to the first photo that has a file. */
export async function getHomePhoto(skin: Skin): Promise<Photo | null> {
  const [settings, photos] = await Promise.all([getSettings(), getPhotos()])
  const id = settings.homePhoto[skin]
  return photos.find((p) => p.id === id) ?? photos.find((p) => p.image) ?? photos[0] ?? null
}
