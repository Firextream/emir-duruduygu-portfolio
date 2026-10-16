// Mock adapter: serves lib/content/mock/data.ts with files from /public/content.
import { SITE_LINKS } from '../links'
import { parseMarkdown, type FigureResolver } from '../markdown'
import type { ContentAdapter, Figure, Img, Mood, Photo, Post, Project, Settings } from '../types'
import { isoDate, ratio, toSeconds } from '../util'
import * as data from './data'

const local = (src: string, w: number, h: number, alt: string): Img => ({ src, w, h, alt, source: 'local' })

const photoList: Photo[] = data.photos.map((p) => {
  const title = p.title ?? data.photoDefaults.title
  return {
    id: p.id,
    image: p.src ? local(p.src, p.w, p.h, title) : null,
    file: p.file,
    w: p.w,
    h: p.h,
    ratio: ratio(p.w, p.h),
    title,
    place: p.place ?? data.photoDefaults.place,
    date: p.date ?? data.photoDefaults.date,
    camera: p.camera ?? data.photoDefaults.camera,
    note: p.note ?? null,
  }
})

const figure: FigureResolver = async (ref, caption) => {
  const photo = ref.startsWith('photo:') ? photoList.find((p) => p.id === ref.slice(6)) : undefined
  if (photo) return { image: photo.image, w: photo.w, h: photo.h, ratio: photo.ratio, caption }
  const ph = /^placeholder:(\d+)x(\d+)$/.exec(ref)
  const w = ph ? Number(ph[1]) : 4
  const h = ph ? Number(ph[2]) : 5
  return { image: null, w, h, ratio: ratio(w, h), caption }
}

async function toPost(p: data.MockPost): Promise<Post> {
  const cover: Figure | null = p.cover ? await figure(p.cover, '[Caption — placeholder]') : null
  return {
    slug: p.slug,
    kind: p.kind,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    published: isoDate(p.date),
    year: p.year,
    read: p.read,
    place: p.place,
    tags: p.tags,
    standfirst: p.standfirst,
    marginNote: p.marginNote,
    cover,
    body: await parseMarkdown(p.body, figure),
    video: p.video
      ? {
          host: p.video.host,
          url: p.video.url,
          duration: p.video.duration,
          poster: null,
          chapters: p.video.chapters.map(([time, title]) => ({ time, title, seconds: toSeconds(time) })),
        }
      : null,
  }
}

export const mockAdapter: ContentAdapter = {
  async photos() {
    return photoList
  },
  async mood(): Promise<Mood[]> {
    return data.moodRatios.map(([w, h], i) => ({
      id: 'm' + String(i + 1).padStart(2, '0'),
      image: null,
      w,
      h,
      ratio: ratio(w, h),
      title: '[Reference]',
      source: '[source]',
    }))
  },
  async posts() {
    return Promise.all(data.posts.map(toPost))
  },
  async projects(): Promise<Project[]> {
    return data.projects.map((p) => ({
      ...p,
      img: p.img ? { ...local(p.img.src, p.img.w, p.img.h, `${p.name} — ${p.img.cap}`), cap: p.img.cap } : null,
      drawing: p.drawing
        ? { ...local(p.drawing.src, p.drawing.w, p.drawing.h, `${p.name} — ${p.drawing.cap}`), cap: p.drawing.cap }
        : null,
    }))
  },
  async settings(): Promise<Settings> {
    return { homePhoto: { ...data.settings.homePhoto }, email: data.settings.email, links: SITE_LINKS }
  },
}
