// Data, static params and metadata for /blog and /blog/[slug] in every skin.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPost, getPosts } from '@/lib/content'
import type { Post } from '@/lib/content/types'
import { isPlaceholder } from './gallery'

/** A post without its body — what lists need (keeps client payloads small). */
export type PostSummary = Omit<Post, 'body' | 'cover' | 'standfirst' | 'marginNote'> & { no: number }

const DROPPED = new Set<string>(['body', 'cover', 'standfirst', 'marginNote'])

export const summarize = (p: Post, i: number): PostSummary => {
  const rest = Object.fromEntries(Object.entries(p).filter(([k]) => !DROPPED.has(k))) as Omit<PostSummary, 'no'>
  return { ...rest, no: i + 1 }
}

export interface YearGroup {
  year: string
  posts: PostSummary[]
}

/** Journal groups by year, newest first (the order the adapter returns). */
export function byYear(posts: PostSummary[]): YearGroup[] {
  const groups: YearGroup[] = []
  for (const p of posts) {
    const g = groups.find((x) => x.year === p.year)
    if (g) g.posts.push(p)
    else groups.push({ year: p.year, posts: [p] })
  }
  return groups
}

export const entries = (n: number) => `${n} ${n === 1 ? 'entry' : 'entries'}`

export async function getJournalData() {
  const posts = (await getPosts()).map(summarize)
  return { posts, years: byYear(posts) }
}

export type JournalData = Awaited<ReturnType<typeof getJournalData>>

export async function getPostData(slug: string) {
  const seq = await getPost(decodeURIComponent(slug))
  if (!seq) notFound()
  return seq
}

export type PostData = Awaited<ReturnType<typeof getPostData>>

export async function postStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }))
}

export const journalMetadata: Metadata = {
  title: 'Journal',
  description: 'Essays, video essays and notes by Emir Duruduygu — newest first.',
  alternates: { canonical: '/blog', types: { 'application/rss+xml': '/feed.xml' } },
}

export async function postMetadata(slug: string): Promise<Metadata> {
  const seq = await getPost(decodeURIComponent(slug))
  if (!seq) return { title: 'Not found' }
  const p = seq.item
  const title = isPlaceholder(p.title) ? 'Journal' : p.title
  const image = p.video?.poster ?? p.cover?.image ?? null
  return {
    title,
    description: isPlaceholder(p.excerpt) ? undefined : p.excerpt,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: {
      type: 'article',
      publishedTime: p.published ?? undefined,
      tags: p.tags.filter((t) => !isPlaceholder(t)),
      images: image ? [{ url: image.src, width: image.w, height: image.h, alt: image.alt }] : undefined,
    },
  }
}

/** Tags worth showing in a tag cloud; falls back to the reference's placeholder chips. */
export function tagCloud(posts: PostSummary[], placeholders = 6): string[] {
  const real = [...new Set(posts.flatMap((p) => p.tags).filter((t) => !isPlaceholder(t)))]
  return real.length ? real : Array.from({ length: placeholders }, () => '[tag]')
}
