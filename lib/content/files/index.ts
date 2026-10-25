// Files adapter (CONTENT_SOURCE=files, the default): content/ in this repo, edited with Keystatic at
// /keystatic. It reads with Keystatic's own reader and schema (keystatic.config.ts), so whatever the
// editor saves is what the site shows. Images are files in public/content; their sizes are read
// from the files at build time (pages are static — content changes arrive as commits + a redeploy).
//
// One broken entry is logged and skipped; it never empties a whole collection.
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import path from 'node:path'
import { createReader } from '@keystatic/core/reader'
import probe from 'probe-image-size'
import keystaticConfig from '../../../keystatic.config'
import { SKINS } from '../../skins'
import { SITE_EMAIL, SITE_LINKS } from '../links'
import { parseMarkdown, readMinutes, type FigureResolver } from '../markdown'
import type { About, ContentAdapter, Figure, Img, Mood, Photo, Post, Project, Settings, StageState } from '../types'
import { displayDate, isoDate, logDate, ratio, toSeconds } from '../util'

const reader = () => createReader(process.cwd(), keystaticConfig)
type Reader = ReturnType<typeof reader>

/** Every entry of a collection that reads cleanly, by address. */
async function entries<T>(label: string, list: () => Promise<string[]>, read: (slug: string) => Promise<T | null>) {
  const out: { slug: string; entry: T }[] = []
  for (const slug of (await list()).sort()) {
    try {
      const entry = await read(slug)
      if (entry) out.push({ slug, entry })
    } catch (error) {
      console.error(`[content] files: content/${label}/${slug} can't be read:`, error instanceof Error ? error.message : error)
    }
  }
  return out
}

// ── images ────────────────────────────────────────────────────────────────────

const sizes = new Map<string, Promise<{ w: number; h: number } | null>>()

// globalThis.process on purpose: the build's file tracer (@vercel/nft) resolves a literal
// process.cwd() + 'public' and would copy every photo into every server bundle. next.config's
// exclude covers Linux builds; on Windows it never matches, so the tracer must not see the path.
const projectDir = () => globalThis.process.cwd()

/** Pixel size of a file in public/ (cached per path and modification time). */
async function sizeOf(src: string) {
  const file = path.join(projectDir(), 'public', decodeURI(src.split('?')[0]))
  let key: string
  try {
    key = `${file}@${(await stat(file)).mtimeMs}`
  } catch {
    // at request time on Vercel public/ isn't on disk (it's served by the CDN): only builds and dev can tell
    if (process.env.NODE_ENV !== 'production' || process.env.NEXT_PHASE === 'phase-production-build') {
      console.error(`[content] files: image ${src} is missing from public/`)
    }
    return null
  }
  if (!sizes.has(key)) {
    sizes.set(
      key,
      probe(createReadStream(file))
        // SVGs can report fractional sizes from their viewBox
        .then((r) => (r.width && r.height ? { w: Math.round(r.width), h: Math.round(r.height) } : null))
        .catch((error: unknown) => {
          console.error(`[content] files: can't read the size of ${src}:`, error instanceof Error ? error.message : error)
          return null
        }),
    )
  }
  return sizes.get(key)!
}

async function localImage(src: string | null | undefined, alt: string): Promise<Img | null> {
  if (!src) return null
  const size = await sizeOf(src)
  return size ? { src, w: size.w, h: size.h, alt, source: 'local' } : null
}

/** "4:5", "4x5", "4/5" → [4, 5] */
function ratioOf(value: string | null | undefined, fallback: [number, number]): [number, number] {
  const m = /^\s*(\d+(?:\.\d+)?)\s*[:x×/]\s*(\d+(?:\.\d+)?)\s*$/.exec(value ?? '')
  return m && Number(m[1]) > 0 && Number(m[2]) > 0 ? [Number(m[1]), Number(m[2])] : fallback
}

const placeholderFigure = (w: number, h: number, caption: string): Figure => ({ image: null, w, h, ratio: ratio(w, h), caption })
const imageFigure = (image: Img, caption: string): Figure => ({ image, w: image.w, h: image.h, ratio: ratio(image.w, image.h), caption })

/** Resolves ![caption](photo:<address>) / (placeholder:4x5) / (/content/…) inside Markdown. */
function figureResolver(gallery: Photo[]): FigureResolver {
  return async (ref, caption) => {
    if (ref.startsWith('photo:')) {
      const at = gallery.findIndex((g) => g.id === ref.slice(6))
      const p = gallery[at]
      if (p) return { image: p.image, w: p.w, h: p.h, ratio: p.ratio, caption, no: at + 1 }
    }
    const ph = /^placeholder:(\d+)x(\d+)$/.exec(ref)
    if (ph) return placeholderFigure(Number(ph[1]), Number(ph[2]), caption)
    if (ref.startsWith('/')) {
      const image = await localImage(ref, caption)
      if (image) return imageFigure(image, caption)
    }
    return placeholderFigure(4, 5, caption)
  }
}

// ── ordering ──────────────────────────────────────────────────────────────────

interface Sortable {
  order: number | null
  /** ISO date; null while it's a placeholder */
  date: string | null
  slug: string
}

const byOrder = (a: Sortable, b: Sortable) => (a.order === b.order ? 0 : a.order === null ? 1 : b.order === null ? -1 : a.order - b.order)
const byDate = (a: Sortable, b: Sortable) => (a.date === b.date ? 0 : a.date === null ? 1 : b.date === null ? -1 : b.date.localeCompare(a.date))

/** Gallery, moodboard, Lab: explicit order first (lower first), then newest date, then address. */
const byOrderThenDate = (a: Sortable, b: Sortable) => byOrder(a, b) || byDate(a, b) || a.slug.localeCompare(b.slug)

/** Journal: newest first; posts with the same date (or none yet) by order, then address. */
const newestFirst = (a: Sortable, b: Sortable) => byDate(a, b) || byOrder(a, b) || a.slug.localeCompare(b.slug)

// ── collections ───────────────────────────────────────────────────────────────

const PHOTO_PLACEHOLDER = { title: '[Photo title]', place: '[Place]', date: '[MM.YYYY]', camera: '[Camera — placeholder]' }

async function readPhotos(r: Reader): Promise<Photo[]> {
  const list = await entries('photos', () => r.collections.photos.list(), (slug) => r.collections.photos.read(slug))
  const rows = await Promise.all(
    list.map(async ({ slug, entry: p }) => {
      const title = p.title || PHOTO_PLACEHOLDER.title
      const image = await localImage(p.image, p.alt || title)
      const [w, h] = image ? [image.w, image.h] : ratioOf(p.placeholder_ratio, [4, 5])
      const photo: Photo = {
        id: slug,
        image,
        file: image ? path.posix.basename(image.src) : p.file || `${slug}.jpg`,
        w,
        h,
        ratio: ratio(w, h),
        title,
        place: p.place || PHOTO_PLACEHOLDER.place,
        date: p.date ? displayDate(p.date).slice(3) : PHOTO_PLACEHOLDER.date,
        camera: p.camera || PHOTO_PLACEHOLDER.camera,
        note: p.note || null,
        ...(p.medium !== 'unset' ? { medium: p.medium } : {}),
        ...(p.tags.length ? { tags: [...p.tags] } : {}),
      }
      return { order: p.order, date: p.date, slug, photo }
    }),
  )
  return rows.sort(byOrderThenDate).map((row) => row.photo)
}

async function readMood(r: Reader): Promise<Mood[]> {
  const list = await entries('mood', () => r.collections.mood.list(), (slug) => r.collections.mood.read(slug))
  const rows = await Promise.all(
    list.map(async ({ slug, entry: m }) => {
      const title = m.title || '[Reference]'
      const image = await localImage(m.image, title)
      const [w, h] = image ? [image.w, image.h] : ratioOf(m.placeholder_ratio, [1, 1])
      const mood: Mood = { id: slug, image, w, h, ratio: ratio(w, h), title, source: m.source || '[source]' }
      return { order: m.order, date: null, slug, mood }
    }),
  )
  return rows.sort(byOrderThenDate).map((row) => row.mood)
}

async function readPosts(r: Reader, gallery: Photo[]): Promise<Post[]> {
  const resolve = figureResolver(gallery)
  const list = await entries('posts', () => r.collections.posts.list(), (slug) =>
    r.collections.posts.read(slug, { resolveLinkedFiles: true }),
  )
  const rows = await Promise.all(
    list.map(async ({ slug, entry: p }) => {
      const kind = p.kind.discriminant
      const v = p.kind.discriminant === 'video' ? p.kind.value : null
      const title = p.title || '[Untitled]'
      const body = p.body ?? ''
      const duration = v?.duration || '[mm:ss]'
      const caption = p.cover_caption || title
      const coverImage = kind === 'video' ? null : await localImage(p.cover_image, caption)
      const cover: Figure | null =
        kind === 'video' ? null : coverImage ? imageFigure(coverImage, caption) : p.cover ? await resolve(`photo:${p.cover}`, caption) : null
      const post: Post = {
        slug,
        kind,
        title,
        excerpt: p.excerpt,
        date: p.date ? displayDate(p.date) : '[DD.MM.YYYY]',
        published: isoDate(p.date),
        year: p.date ? p.date.slice(0, 4) : p.year || '[year]',
        read: kind === 'video' ? `▶ ${duration}` : p.read_time || `${readMinutes(body)} min`,
        place: p.place || '[Place]',
        tags: [...p.tags],
        standfirst: p.standfirst,
        marginNote: p.margin_note || null,
        cover,
        body: await parseMarkdown(body, resolve),
        video: v
          ? {
              host: v.host,
              url: v.url || null,
              duration,
              poster: await localImage(v.poster, `${title} — poster`),
              chapters: v.chapters
                .filter((c) => c.time || c.title)
                .map((c) => ({ time: c.time || '[mm:ss]', title: c.title || '[Chapter title]', seconds: toSeconds(c.time) })),
            }
          : null,
      }
      return { order: p.order, date: p.date, slug, post }
    }),
  )
  return rows.sort(newestFirst).map((row) => row.post)
}

async function readProjects(r: Reader, gallery: Photo[]): Promise<Project[]> {
  const resolve = figureResolver(gallery)
  const list = await entries('projects', () => r.collections.projects.list(), (slug) =>
    r.collections.projects.read(slug, { resolveLinkedFiles: true }),
  )
  const rows = await Promise.all(
    list.map(async ({ slug, entry: p }) => {
      const name = p.name || '[Project]'
      const imageCap = p.image_caption || name
      const drawingCap = p.drawing_caption || 'Drawing'
      const image = await localImage(p.image, `${name} — ${imageCap}`)
      const drawing = await localImage(p.drawing, `${name} — ${drawingCap}`)
      const [pw, ph] = ratioOf(p.placeholder_ratio, [4, 5])
      const project: Project = {
        slug,
        name,
        kind: p.kind || '[kind]',
        one: p.one_liner,
        status: p.status || '[status]',
        year: p.year || '[year]',
        tools: p.tools || '[tools]',
        img: image ? { ...image, cap: imageCap } : null,
        drawing: drawing ? { ...drawing, cap: drawingCap } : null,
        ph: image ? null : { w: pw, h: ph },
        stages: p.stages.filter((s) => s.label).map((s) => ({ label: s.label, state: s.state as StageState })),
        about: await parseMarkdown(p.about ?? '', resolve),
        photos: await Promise.all(
          p.photos.map(async (x) => {
            const photo = await localImage(x.image, x.caption || name)
            if (photo) return imageFigure(photo, x.caption)
            const [w, h] = ratioOf(x.placeholder_ratio, [4, 5])
            return placeholderFigure(w, h, x.caption)
          }),
        ),
        // newest first (placeholder dates keep their order)
        log: p.log
          .map((l) => ({ date: l.date ? logDate(l.date) : '[YYYY.MM.DD]', title: l.title, text: l.text }))
          .sort((a, b) => b.date.localeCompare(a.date)),
      }
      return { order: p.order, date: null, slug, project }
    }),
  )
  return rows.sort(byOrderThenDate).map((row) => row.project)
}

// ── singletons ────────────────────────────────────────────────────────────────

async function readAbout(r: Reader, gallery: Photo[]): Promise<About> {
  const [a, m] = await Promise.all([r.singletons.about.read(), r.singletons.milestones.read()])
  return {
    portrait: await localImage(a?.portrait, 'Emir Duruduygu'),
    summary: a?.summary ?? '',
    body: await parseMarkdown(a?.body ?? '', figureResolver(gallery)),
    currently: a?.currently ?? '',
    location: a?.location || 'Istanbul, TR',
    study: a?.study ?? '',
    milestones: (m?.items ?? [])
      .filter((x) => x.year || x.title || x.text)
      .map((x) => ({ year: x.year || '[year]', title: x.title || undefined, text: x.text })),
    shooting: a?.shooting ?? '',
    listening: a?.listening ?? '',
  }
}

async function readSettings(r: Reader): Promise<Settings> {
  const s = (await r.singletons.settings.read()) as Record<string, string | null> | null
  return {
    homePhoto: Object.fromEntries(SKINS.map((k) => [k, s?.[`home_photo_${k}`] ?? null])),
    email: s?.email || SITE_EMAIL,
    links: SITE_LINKS,
  }
}

export const filesAdapter: ContentAdapter = {
  photos: () => readPhotos(reader()),
  mood: () => readMood(reader()),
  async posts() {
    const r = reader()
    return readPosts(r, await readPhotos(r))
  },
  async projects() {
    const r = reader()
    return readProjects(r, await readPhotos(r))
  },
  async about() {
    const r = reader()
    return readAbout(r, await readPhotos(r))
  },
  settings: () => readSettings(reader()),
}
