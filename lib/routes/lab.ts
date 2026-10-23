// Data, static params and metadata for /lab and /lab/[slug] in every skin.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLabNotes, getProject, getProjects } from '@/lib/content'
import type { Project } from '@/lib/content/types'
import { isPlaceholder } from './gallery'

/** A project without its long fields — what the lists need (keeps client payloads small). */
export type ProjectSummary = Omit<Project, 'about' | 'photos' | 'log' | 'stages'> & { no: number }

const DROPPED = new Set<string>(['about', 'photos', 'log', 'stages'])

export const summarizeProject = (p: Project, i: number): ProjectSummary => {
  const rest = Object.fromEntries(Object.entries(p).filter(([k]) => !DROPPED.has(k))) as Omit<ProjectSummary, 'no'>
  return { ...rest, no: i + 1 }
}

/** "Hardware · Clothes" — the kinds in order of first appearance. */
export const areasOf = (projects: { kind: string }[]) => [...new Set(projects.map((p) => p.kind))]

export const isClothes = (p: { kind: string }) => p.kind.toLowerCase() === 'clothes'

export async function getLabData() {
  const [projects, notes] = await Promise.all([getProjects(), getLabNotes()])
  return { projects: projects.map(summarizeProject), notes }
}

export type LabData = Awaited<ReturnType<typeof getLabData>>

export async function getProjectData(slug: string) {
  const seq = await getProject(decodeURIComponent(slug))
  if (!seq) notFound()
  return seq
}

export type ProjectData = Awaited<ReturnType<typeof getProjectData>>

export async function projectStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }))
}

export const labMetadata: Metadata = {
  title: 'Lab',
  description: 'Small electronic objects and made-to-measure clothes, designed in Istanbul. Experiments, not products.',
  alternates: { canonical: '/lab' },
}

export async function projectMetadata(slug: string): Promise<Metadata> {
  const seq = await getProject(decodeURIComponent(slug))
  if (!seq) return { title: 'Not found' }
  const p = seq.item
  return {
    title: p.name,
    description: isPlaceholder(p.one) ? undefined : p.one,
    alternates: { canonical: `/lab/${p.slug}` },
    openGraph: p.img ? { images: [{ url: p.img.src, width: p.img.w, height: p.img.h, alt: p.img.alt }] } : undefined,
  }
}
