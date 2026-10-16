// A deliberately small Markdown subset for journal bodies, parsed on the server into typed
// blocks so each skin can lay them out (figure pairs, pull quotes) without innerHTML.
//
//   ## Heading / ### Heading      → h2 / h3 (also used as video chapter headings)
//   > A line worth pulling out     → quote
//   ![Caption](photo:p02)          → figure; two images in one block → a figure pair
//   *em*  **strong**  `code`  [text](https://…)
//
// Image refs: `photo:<id>` (a gallery photo), `asset:<directus-file-id>`, `placeholder:4x5`, or a URL.
import type { Block, Figure, Inline } from './types'

export type FigureResolver = (ref: string, caption: string) => Promise<Figure>

const IMAGE = /^!\[([^\]]*)\]\(\s*([^)\s]+)(?:\s+"([^"]*)")?\s*\)$/

export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section'
  )
}

export function parseInline(src: string): Inline[] {
  const out: Inline[] = []
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)/g
  let last = 0
  for (let m = re.exec(src); m; m = re.exec(src)) {
    if (m.index > last) out.push({ t: 'text', v: src.slice(last, m.index) })
    if (m[1]) out.push({ t: 'strong', v: m[1] })
    else if (m[2] || m[3]) out.push({ t: 'em', v: (m[2] || m[3]) as string })
    else if (m[4]) out.push({ t: 'code', v: m[4] })
    else if (m[5] && m[6]) out.push({ t: 'link', v: m[5], href: m[6] })
    last = m.index + m[0].length
  }
  if (last < src.length) out.push({ t: 'text', v: src.slice(last) })
  return out
}

export async function parseMarkdown(md: string, resolve: FigureResolver): Promise<Block[]> {
  const blocks: Block[] = []
  const used = new Set<string>()
  const chunks = md.replace(/\r\n/g, '\n').split(/\n\s*\n/)
  for (const raw of chunks) {
    const chunk = raw.trim()
    if (!chunk) continue
    const lines = chunk.split('\n').map((l) => l.trim())

    const h = /^(#{2,3})\s+(.+)$/.exec(chunk)
    if (h && lines.length === 1) {
      let id = slugify(h[2])
      for (let n = 2; used.has(id); n++) id = `${slugify(h[2])}-${n}`
      used.add(id)
      blocks.push({ type: h[1].length === 2 ? 'h2' : 'h3', text: h[2].trim(), id })
      continue
    }

    if (lines.every((l) => l.startsWith('>'))) {
      blocks.push({ type: 'quote', children: parseInline(lines.map((l) => l.replace(/^>\s?/, '')).join(' ')) })
      continue
    }

    const imgs = lines.flatMap((l) => l.split(/(?<=\))\s+(?=!\[)/)).map((l) => IMAGE.exec(l))
    if (imgs.every(Boolean)) {
      const items = await Promise.all(imgs.map((m) => resolve(m![2], (m![3] ?? m![1]).trim())))
      blocks.push({ type: 'figures', items })
      continue
    }

    blocks.push({ type: 'p', children: parseInline(lines.join(' ')) })
  }
  return blocks
}

/** Rough reading time for posts that don't set one. */
export function readMinutes(md: string): number {
  const words = md.replace(/!\[[^\]]*\]\([^)]*\)/g, '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}
