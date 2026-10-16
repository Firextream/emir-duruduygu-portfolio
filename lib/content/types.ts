// The content model shared by every skin. Mirrors design_handoff_duruduygu/duru-content.js.
// Adapters (mock, directus) return these shapes; pages never see where data came from.

export type Skin = 'quiet' | 'soft' | 'modern'

/** A real image file. `null` wherever the design shows a striped placeholder. */
export interface Img {
  src: string
  w: number
  h: number
  alt: string
  /** local = served from /public through the Next optimizer; directus = Directus asset transforms */
  source: 'local' | 'directus'
}

export interface Photo {
  id: string
  image: Img | null
  file: string
  /** native ratio — also set for placeholders so they keep their proportions */
  w: number
  h: number
  ratio: string
  title: string
  place: string
  date: string
  camera: string
  note: string | null
}

export interface Mood {
  id: string
  image: Img | null
  w: number
  h: number
  ratio: string
  title: string
  source: string
}

export type PostKind = 'essay' | 'video' | 'note'

export interface VideoChapter {
  time: string
  title: string
  /** null while the timestamp is still a placeholder */
  seconds: number | null
}

export interface Video {
  /** 'YouTube' | 'Vimeo' | 'File' */
  host: string
  url: string | null
  duration: string
  poster: Img | null
  chapters: VideoChapter[]
}

export type Inline =
  | { t: 'text'; v: string }
  | { t: 'em'; v: string }
  | { t: 'strong'; v: string }
  | { t: 'code'; v: string }
  | { t: 'link'; v: string; href: string }

export interface Figure {
  image: Img | null
  w: number
  h: number
  ratio: string
  caption: string
}

export type Block =
  | { type: 'p'; children: Inline[] }
  | { type: 'h2' | 'h3'; text: string; id: string }
  | { type: 'quote'; children: Inline[] }
  | { type: 'figures'; items: Figure[] }

export interface Post {
  slug: string
  kind: PostKind
  title: string
  excerpt: string
  date: string
  year: string
  /** "[n] min" for essays/notes, "▶ mm:ss" for videos */
  read: string
  place: string
  tags: string[]
  video: Video | null
  standfirst: string
  marginNote: string | null
  /** Fig. 01 above the text (essays and notes) */
  cover: Figure | null
  body: Block[]
}

export interface LogEntry {
  date: string
  title: string
  text: string
}

export interface ProjectImage extends Img {
  cap: string
}

export interface Project {
  slug: string
  name: string
  kind: string
  one: string
  status: string
  year: string
  tools: string
  img: ProjectImage | null
  drawing: ProjectImage | null
  /** placeholder proportions when there is no image yet */
  ph: { w: number; h: number } | null
  log: LogEntry[]
}

export interface LabNote extends LogEntry {
  project: string
  slug: string
}

export interface SiteLink {
  label: 'Instagram' | 'LinkedIn' | 'GitHub' | 'RSS'
  href: string
}

export interface Settings {
  /** photo id per skin (admin-picked in Directus: settings.home_photo_*) */
  homePhoto: Record<Skin, string | null>
  email: string
  links: SiteLink[]
}

export interface ContentAdapter {
  photos(): Promise<Photo[]>
  mood(): Promise<Mood[]>
  /** newest first */
  posts(): Promise<Post[]>
  projects(): Promise<Project[]>
  settings(): Promise<Settings>
}
