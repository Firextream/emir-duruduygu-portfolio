// Directus adapter (CONTENT_SOURCE=directus). Collections and fields are documented in SCHEMA.md.
// Reuses the existing setup: DIRECTUS_URL, DIRECTUS_STATIC_TOKEN and the DIRECTUS_*_COLLECTION overrides.
// Images are returned as Directus asset URLs; components/site/ContentImage adds the
// transform query (format=webp, width, quality) so next/image gets a real srcset.
import { SKINS } from '../../skins'
import { SITE_EMAIL, SITE_LINKS } from '../links'
import { parseMarkdown, readMinutes, type FigureResolver } from '../markdown'
import type { About, ContentAdapter, Figure, Img, Mood, Photo, Post, PostKind, Project, ProjectImage, Settings, Stage, StageState } from '../types'
import { displayDate, isoDate, logDate, ratio, toSeconds } from '../util'

const REVALIDATE = 300
export const CONTENT_TAG = 'content'

const env = (key: string, fallback = '') => (process.env[key] || fallback).trim()
const baseUrl = () => env('DIRECTUS_URL').replace(/\/+$/, '')
const assetsUrl = () => (env('DIRECTUS_ASSETS_URL') || env('DIRECTUS_URL')).replace(/\/+$/, '')
const token = () => env('DIRECTUS_STATIC_TOKEN') || env('DIRECTUS_TOKEN')

const C = {
  photos: () => env('DIRECTUS_GALLERY_COLLECTION', 'photos'),
  mood: () => env('DIRECTUS_MOODBOARD_COLLECTION', 'mood'),
  posts: () => env('DIRECTUS_POSTS_COLLECTION', 'posts'),
  projects: () => env('DIRECTUS_PROJECTS_COLLECTION', 'projects'),
  log: () => env('DIRECTUS_PROJECT_LOG_COLLECTION', 'project_log'),
  settings: () => env('DIRECTUS_SETTINGS_COLLECTION', 'settings'),
  about: () => env('DIRECTUS_ABOUT_COLLECTION', 'about'),
}

type Row = Record<string, unknown>
interface DFile {
  id: string
  width?: number | null
  height?: number | null
  title?: string | null
  description?: string | null
}

const FILE = 'id,width,height,title,description'
const published = { status: { _eq: 'published' } }

async function request<T>(path: string, query: Record<string, unknown> = {}): Promise<T> {
  const base = baseUrl()
  if (!base) throw new Error('DIRECTUS_URL is not set')
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(query)) qs.set(k, typeof v === 'string' ? v : JSON.stringify(v))
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (token()) headers.Authorization = `Bearer ${token()}`
  const res = await fetch(`${base}${path}?${qs}`, { headers, next: { revalidate: REVALIDATE, tags: [CONTENT_TAG] } })
  if (!res.ok) throw new Error(`${path} → HTTP ${res.status}`)
  const json = (await res.json()) as { data: T }
  return json.data
}

const items = (collection: string, query: Record<string, unknown>) =>
  request<Row[]>(`/items/${collection}`, { limit: '-1', ...query })

const str = (v: unknown, fallback = '') => (typeof v === 'string' && v.trim() ? v.trim() : fallback)
const num = (v: unknown) => (typeof v === 'number' && v > 0 ? v : null)

function img(file: unknown, alt: string, w?: number | null, h?: number | null): Img | null {
  const f = file as DFile | null
  if (!f || typeof f !== 'object' || !f.id) return null
  const width = w ?? num(f.width)
  const height = h ?? num(f.height)
  if (!width || !height) return null
  return { src: `${assetsUrl()}/assets/${f.id}`, w: width, h: height, alt: alt || str(f.description) || str(f.title), source: 'directus' }
}

function toPhoto(r: Row): Photo {
  const file = r.image as DFile | null
  const w = num(r.width) ?? num(file?.width) ?? 4
  const h = num(r.height) ?? num(file?.height) ?? 5
  const title = str(r.title, '[Photo title]')
  return {
    id: str(r.slug) || String(r.id),
    image: img(file, str(r.alt) || title, w, h),
    file: str(file?.title) || String(r.id),
    w,
    h,
    ratio: ratio(w, h),
    title,
    place: str(r.place, '[Place]'),
    date: str(r.date) ? displayDate(str(r.date)).slice(3) : '[MM.YYYY]',
    camera: str(r.camera, '[Camera — placeholder]'),
    note: str(r.note) || null,
  }
}

async function photos(): Promise<Photo[]> {
  const rows = await items(C.photos(), {
    filter: published,
    sort: 'sort,-date',
    fields: `id,slug,title,alt,place,date,camera,note,width,height,image.${FILE.split(',').join(',image.')}`,
  })
  return rows.map(toPhoto)
}

async function mood(): Promise<Mood[]> {
  const rows = await items(C.mood(), {
    filter: published,
    sort: 'sort',
    fields: `id,title,source,width,height,image.${FILE.split(',').join(',image.')}`,
  })
  return rows.map((r) => {
    const file = r.image as DFile | null
    const w = num(r.width) ?? num(file?.width) ?? 1
    const h = num(r.height) ?? num(file?.height) ?? 1
    const title = str(r.title, '[Reference]')
    return { id: String(r.id), image: img(file, title, w, h), w, h, ratio: ratio(w, h), title, source: str(r.source, '[source]') }
  })
}

/** Resolves ![caption](photo:<id>) / (asset:<file-id>) / (<…>/assets/<file-id>) inside post bodies. */
function figureResolver(gallery: Photo[]): FigureResolver {
  return async (ref, caption) => {
    if (ref.startsWith('photo:')) {
      const at = gallery.findIndex((g) => g.id === ref.slice(6))
      const p = gallery[at]
      if (p) return { image: p.image, w: p.w, h: p.h, ratio: p.ratio, caption, no: at + 1 }
    }
    const id = ref.startsWith('asset:') ? ref.slice(6) : /\/assets\/([0-9a-f-]{36})/i.exec(ref)?.[1]
    if (id) {
      try {
        const f = await request<DFile>(`/files/${id}`, { fields: FILE })
        const image = img(f, caption)
        if (image) return { image, w: image.w, h: image.h, ratio: ratio(image.w, image.h), caption }
      } catch {
        // fall through to a placeholder
      }
    }
    return { image: null, w: 4, h: 5, ratio: '4:5', caption }
  }
}

function asFigure(file: unknown, caption: string): Figure | null {
  const image = img(file, caption)
  return image ? { image, w: image.w, h: image.h, ratio: ratio(image.w, image.h), caption } : null
}

function chaptersOf(v: unknown) {
  const list = Array.isArray(v) ? v : typeof v === 'string' ? (JSON.parse(v || '[]') as unknown[]) : []
  return list
    .map((c) => c as { time?: string; title?: string })
    .filter((c) => c && (c.time || c.title))
    .map((c) => ({ time: str(c.time, '[mm:ss]'), title: str(c.title, '[Chapter title]'), seconds: toSeconds(str(c.time)) }))
}

async function posts(): Promise<Post[]> {
  const [rows, gallery] = await Promise.all([
    items(C.posts(), {
      filter: published,
      sort: '-date',
      fields: [
        'slug,kind,title,excerpt,date,place,tags,read_time,standfirst,content,margin_note,cover_caption',
        'video_host,video_url,video_duration,chapters',
        `cover_image.${FILE.split(',').join(',cover_image.')}`,
        `video_poster.${FILE.split(',').join(',video_poster.')}`,
      ].join(','),
    }),
    photos().catch(() => [] as Photo[]),
  ])
  const resolve = figureResolver(gallery)
  return Promise.all(
    rows.map(async (r) => {
      const kind = (['essay', 'video', 'note'].includes(str(r.kind)) ? str(r.kind) : 'essay') as PostKind
      const content = str(r.content)
      const duration = str(r.video_duration, '[mm:ss]')
      const date = str(r.date)
      const tags = Array.isArray(r.tags) ? (r.tags as unknown[]).map(String) : str(r.tags).split(',').map((t) => t.trim()).filter(Boolean)
      const title = str(r.title, '[Untitled]')
      return {
        slug: str(r.slug),
        kind,
        title,
        excerpt: str(r.excerpt),
        date: displayDate(date) || '[DD.MM.YYYY]',
        published: isoDate(date),
        year: date.slice(0, 4) || '[year]',
        read: kind === 'video' ? `▶ ${duration}` : str(r.read_time) || `${readMinutes(content)} min`,
        place: str(r.place, '[Place]'),
        tags,
        standfirst: str(r.standfirst),
        marginNote: str(r.margin_note) || null,
        cover: kind === 'video' ? null : asFigure(r.cover_image, str(r.cover_caption) || title),
        body: await parseMarkdown(content, resolve),
        video:
          kind === 'video'
            ? {
                host: str(r.video_host, 'YouTube'),
                url: str(r.video_url) || null,
                duration,
                poster: img(r.video_poster, `${title} — poster`),
                chapters: chaptersOf(r.chapters),
              }
            : null,
      } satisfies Post
    }),
  ).then((list) => list.filter((p) => p.slug))
}

function projectImage(file: unknown, cap: string, name: string): ProjectImage | null {
  const image = img(file, `${name} — ${cap}`)
  return image ? { ...image, cap } : null
}

const STAGE_STATES: readonly StageState[] = ['done', 'now', 'next']

function stagesOf(v: unknown): Stage[] {
  const list = Array.isArray(v) ? v : typeof v === 'string' ? (JSON.parse(v || '[]') as unknown[]) : []
  return list
    .map((s) => s as { label?: string; state?: string })
    .filter((s) => s && s.label)
    .map((s) => ({ label: str(s.label), state: STAGE_STATES.find((k) => k === s.state) ?? 'next' }))
}

async function projects(): Promise<Project[]> {
  const [rows, gallery] = await Promise.all([
    items(C.projects(), {
      filter: published,
      sort: 'sort',
      fields: [
        'slug,name,kind,one_liner,stage,year,tools,image_caption,drawing_caption,placeholder_ratio,stages,about',
        `image.${FILE.split(',').join(',image.')}`,
        `drawing.${FILE.split(',').join(',drawing.')}`,
        // photos: a Files (M2M) field; the caption is the file's title
        `photos.directus_files_id.${FILE.split(',').join(',photos.directus_files_id.')}`,
        'log.date,log.title,log.text',
      ].join(','),
    }),
    photos().catch(() => [] as Photo[]),
  ])
  const resolve = figureResolver(gallery)
  return Promise.all(
    rows.map(async (r) => {
      const name = str(r.name, '[Project]')
      const [pw, ph] = str(r.placeholder_ratio, '4:5').split(':').map(Number)
      const log = (Array.isArray(r.log) ? (r.log as Row[]) : [])
        .map((l) => ({ date: logDate(str(l.date)) || '[YYYY.MM.DD]', title: str(l.title), text: str(l.text) }))
        .sort((a, b) => b.date.localeCompare(a.date))
      const image = projectImage(r.image, str(r.image_caption, name), name)
      const extra = (Array.isArray(r.photos) ? (r.photos as Row[]) : [])
        .map((j) => j.directus_files_id as DFile | null)
        .map((f) => asFigure(f, str(f?.title) || str(f?.description) || name))
        .filter((f): f is Figure => !!f)
      return {
        slug: str(r.slug),
        name,
        kind: str(r.kind, '[kind]'),
        one: str(r.one_liner),
        status: str(r.stage, '[status]'),
        year: str(r.year, '[year]'),
        tools: str(r.tools, '[tools]'),
        img: image,
        drawing: projectImage(r.drawing, str(r.drawing_caption, 'Drawing'), name),
        ph: image ? null : { w: pw || 4, h: ph || 5 },
        stages: stagesOf(r.stages),
        about: await parseMarkdown(str(r.about), resolve),
        photos: extra,
        log,
      } satisfies Project
    }),
  ).then((list) => list.filter((p) => p.slug))
}

function milestonesOf(v: unknown) {
  const list = Array.isArray(v) ? v : typeof v === 'string' ? (JSON.parse(v || '[]') as unknown[]) : []
  return list
    .map((m) => m as { year?: string; title?: string; text?: string })
    .filter((m) => m && (m.year || m.title || m.text))
    .map((m) => ({ year: str(m.year, '[year]'), title: str(m.title) || undefined, text: str(m.text) }))
}

async function about(): Promise<About> {
  // a singleton: /items/about returns the one row
  const [r, gallery] = await Promise.all([
    request<Row | null>(`/items/${C.about()}`, {
      fields: ['summary,body,currently,location,study,milestones,shooting,listening', `portrait.${FILE.split(',').join(',portrait.')}`].join(','),
    }),
    photos().catch(() => [] as Photo[]),
  ])
  return {
    portrait: img(r?.portrait, 'Emir Duruduygu'),
    summary: str(r?.summary),
    body: await parseMarkdown(str(r?.body), figureResolver(gallery)),
    currently: str(r?.currently),
    location: str(r?.location, 'Istanbul, TR'),
    study: str(r?.study),
    milestones: milestonesOf(r?.milestones),
    shooting: str(r?.shooting),
    listening: str(r?.listening),
  }
}

async function settings(): Promise<Settings> {
  const s = await request<Row | null>(`/items/${C.settings()}`, {
    // one M2O field per skin: home_photo_<skin>
    fields: ['email', ...SKINS.flatMap((k) => [`home_photo_${k}.id`, `home_photo_${k}.slug`])].join(','),
  })
  const pick = (v: unknown) => {
    const r = v as Row | null
    return r ? str(r.slug) || String(r.id) : null
  }
  return {
    homePhoto: Object.fromEntries(SKINS.map((k) => [k, pick(s?.[`home_photo_${k}`])])),
    email: str(s?.email, SITE_EMAIL),
    links: SITE_LINKS,
  }
}

export const directusAdapter: ContentAdapter = { photos, mood, posts, projects, about, settings }
