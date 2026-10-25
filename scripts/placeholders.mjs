// Lists every placeholder still in content/: [bracketed] copy, dates not set yet, and photos or
// projects that still show a striped placeholder instead of an image.
//   npm run placeholders            grouped by file, with line numbers
//   npm run placeholders -- --count one line per file
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

// [text] — it may wrap onto the next line in folded YAML — but not a Markdown link's [text](url)
const BRACKETED = /\[(?!\s*\])[^\][]{2,400}?\](?!\()/g

function* walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) yield* walk(p)
    else if (/\.(ya?ml|md|mdx|json)$/.test(e.name)) yield p
  }
}

const found = []
for (const file of walk('content')) {
  const text = readFileSync(file, 'utf8').replace(/\r\n/g, '\n')
  const rel = relative('.', file).replace(/\\/g, '/')
  const hits = []

  // Keystatic escapes brackets when it saves (\[ … \]): blank the backslash so line numbers still hold
  const plain = text.replace(/\\([[\]])/g, ' $1')
  const seen = new Set()
  for (const m of plain.matchAll(BRACKETED)) {
    const line = plain.slice(0, m.index).split('\n').length
    const copy = m[0].replace(/\s+/g, ' ').replace(/^\[ /, '[').replace(/ \]$/, ']')
    if (!seen.has(line + copy)) hits.push(`${line}: ${copy}`)
    seen.add(line + copy)
  }

  const frontmatter = rel.endsWith('.md') ? (/^---\n([^]*?)\n---/.exec(text)?.[1] ?? '') : text
  const has = (key) => new RegExp(`^${key}:`, 'm').test(frontmatter)
  if (/^content\/(photos|posts)\//.test(rel) && !has('date')) hits.push('— date not set')
  if (/^content\/(photos|mood)\//.test(rel) && !has('image')) hits.push('— no image yet (striped placeholder)')
  if (rel.startsWith('content/projects/') && !has('image')) hits.push('— no project image yet (striped placeholder)')

  // design log: one "  - " per entry; count the entries without a date line
  const log = /^log:\n((?:[ -][^\n]*\n?)*)/m.exec(frontmatter)?.[1] ?? ''
  const undated = log
    .split(/^ {2}- /m)
    .slice(1)
    .filter((entry) => !/^(?: {4})?date:/m.test(entry)).length
  if (undated) hits.push(`— design log: ${undated} entr${undated === 1 ? 'y' : 'ies'} without a date`)

  if (hits.length) found.push([rel, hits])
}

const total = found.reduce((n, [, h]) => n + h.length, 0)
for (const [file, hits] of found) {
  console.log(process.argv.includes('--count') ? `${String(hits.length).padStart(3)}  ${file}` : `${file}\n  ${hits.join('\n  ')}`)
}
console.log(`\n${total} placeholder(s) in ${found.length} file(s).`)
