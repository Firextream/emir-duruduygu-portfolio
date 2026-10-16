// Mock content — a TypeScript port of design_handoff_duruduygu/duru-content.js.
// Bracketed text is placeholder copy and stays visible on the site until real content exists.
// Files live in /public/content.

export interface MockPhoto {
  id: string
  src: string | null
  file: string
  w: number
  h: number
  title?: string
  place?: string
  date?: string
  camera?: string
  note?: string
}

export const photos: MockPhoto[] = [
  { id: 'p01', src: '/content/IMG_3849.webp', file: 'IMG_3849.webp', w: 960, h: 640 },
  { id: 'p02', src: '/content/harbor.png', file: 'harbor.png', w: 1440, h: 960 },
  { id: 'p03', src: null, file: 'frame_03.jpg', w: 4, h: 5 },
  { id: 'p04', src: null, file: 'frame_04_pano.jpg', w: 3, h: 1, title: '[Panorama title]' },
  { id: 'p05', src: null, file: 'frame_05.jpg', w: 1, h: 1 },
  { id: 'p06', src: null, file: 'frame_06.jpg', w: 3, h: 2 },
  { id: 'p07', src: null, file: 'frame_07.jpg', w: 2, h: 3 },
  { id: 'p08', src: null, file: 'frame_08.jpg', w: 16, h: 9 },
  { id: 'p09', src: null, file: 'frame_09.jpg', w: 4, h: 5 },
]

export const photoDefaults = {
  title: '[Photo title]',
  place: '[Place]',
  date: '[MM.YYYY]',
  camera: '[Camera — placeholder]',
}

export const moodRatios: [number, number][] = [
  [3, 4], [1, 1], [4, 3], [2, 3], [1, 1], [3, 2], [4, 5], [1, 1], [3, 4], [16, 9], [2, 3], [1, 1],
]

const chapters: [string, string][] = [
  ['00:00', '[Chapter title]'],
  ['[mm:ss]', '[Chapter title]'],
  ['[mm:ss]', '[Chapter title]'],
  ['[mm:ss]', '[Chapter title]'],
]

const BODY = '[Body text placeholder. This is where the entry is written. Lines run at around sixty-five characters so long reading stays comfortable, with generous leading and clear space between paragraphs.]'

/** Essay/note body: mirrors the reference post (subheading, figure pair, pull quote). */
const essayBody = [
  BODY,
  BODY,
  '## [Subheading — placeholder]',
  BODY,
  '![[Caption]](photo:p03) ![[Caption]](photo:p01)',
  '> [A line worth pulling out of the entry — placeholder.]',
  BODY,
  BODY,
].join('\n\n')

/** Video body: the transcript, one heading per chapter. */
const videoBody = (n: number) =>
  [
    '[Intro — what this video essay sets out to do, for people who would rather read it — placeholder]',
    ...chapters.slice(0, n).flatMap(([, title]) => [`## ${title}`, BODY]),
  ].join('\n\n')

export interface MockPost {
  slug: string
  kind: 'essay' | 'video' | 'note'
  title: string
  excerpt: string
  date: string
  year: string
  read: string
  place: string
  tags: string[]
  standfirst: string
  marginNote: string | null
  cover: string | null
  body: string
  video?: {
    host: string
    url: string | null
    duration: string
    poster: string | null
    chapters: [string, string][]
  }
}

const post = (o: Partial<MockPost> & Pick<MockPost, 'slug' | 'title' | 'year'>): MockPost => ({
  kind: 'essay',
  date: '[DD.MM.YYYY]',
  read: '[n] min',
  place: '[Place]',
  excerpt: '[First line of the entry — placeholder]',
  tags: ['[tag]', '[tag]'],
  standfirst: '[Standfirst — the first lines of the entry, set larger to pull the reader in — placeholder.]',
  marginNote: '[Margin note — placeholder]',
  cover: 'photo:p02',
  body: essayBody,
  ...o,
})

const video = (o: Partial<MockPost> & Pick<MockPost, 'slug' | 'title' | 'year'>, n = 4): MockPost =>
  post({
    kind: 'video',
    read: '▶ [mm:ss]',
    standfirst: '[Intro — what this video essay sets out to do, for people who would rather read it — placeholder]',
    marginNote: null,
    cover: null,
    body: videoBody(n),
    video: { host: 'YouTube', url: null, duration: '[mm:ss]', poster: null, chapters: chapters.slice(0, n) },
    ...o,
  })

export const posts: MockPost[] = [
  video({
    slug: 'video-essay-1',
    year: '[2026]',
    title: '[Video essay title — placeholder]',
    excerpt: '[What the video essay is about, in one line — placeholder]',
  }),
  post({
    slug: 'long-title',
    year: '[2026]',
    title: '[A very long journal entry title that keeps going for three lines or more, to test how every layout wraps it — placeholder]',
  }),
  post({ slug: 'entry-2', year: '[2026]', title: '[Entry title — placeholder]' }),
  video(
    {
      slug: 'video-2',
      year: '[2026]',
      title: '[Video title — placeholder]',
      excerpt: '[One line about the video — placeholder]',
    },
    2,
  ),
  post({ slug: 'entry-3', year: '[2026]', kind: 'note', title: '[Short title]' }),
  post({ slug: 'entry-4', year: '[2026]', title: '[Entry title — placeholder]' }),
  post({ slug: 'entry-5', year: '[2025]', title: '[Entry title — placeholder]' }),
  post({ slug: 'entry-6', year: '[2025]', title: '[Entry title — placeholder]' }),
]

const log = [
  { date: '[YYYY.MM.DD]', title: '[Note title — placeholder]', text: '[What changed and why — placeholder]' },
  { date: '[YYYY.MM.DD]', title: '[Note title — placeholder]', text: '[What changed and why — placeholder]' },
  { date: '[YYYY.MM.DD]', title: '[Note title — placeholder]', text: '[What changed and why — placeholder]' },
  { date: '[YYYY.MM.DD]', title: '[Note title — placeholder]', text: '[What changed and why — placeholder]' },
]

export const projects = [
  {
    slug: 'slab-100',
    name: 'SLAB-100',
    kind: 'Hardware',
    one: 'Pocket music player and DJ controller.',
    status: '[status]',
    year: '[year]',
    tools: '[tools — placeholder]',
    img: { src: '/content/slab-100-beyin.png', w: 784, h: 1432, cap: 'Main board layout' },
    drawing: { src: '/content/slab-100-iso.svg', w: 700, h: 159, cap: 'Isometric drawing' },
    ph: null,
    log,
  },
  {
    slug: 'charm',
    name: 'CHARM',
    kind: 'Hardware',
    one: 'Colour e-ink bag badge with find-me and NFC.',
    status: '[status]',
    year: '[year]',
    tools: '[tools — placeholder]',
    img: null,
    drawing: null,
    ph: { w: 1, h: 1 },
    log,
  },
  {
    slug: 'denim',
    name: 'Made-to-measure denim',
    kind: 'Clothes',
    one: 'Made-to-measure denim.',
    status: '[status]',
    year: '[year]',
    tools: '[tools — placeholder]',
    img: null,
    drawing: null,
    ph: { w: 4, h: 5 },
    log,
  },
]

export const settings = {
  homePhoto: { quiet: 'p01', modern: 'p01', soft: 'p01' },
  email: 'emir@duruduygu.com',
}
