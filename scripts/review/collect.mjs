// Copies review-shots into a dated review folder, named page_skin_width (reference: page_skin_width_ref,
// side by side: page_skin_width_compare), plus the state sheets.
//   node scripts/review/collect.mjs review/2026-10-23 [--from review-shots]
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { SKIN_RE } from './skins.mjs'

const SHOT = new RegExp(`^(ref-|compare-)?(${SKIN_RE})-(\\d+)\\.png$`)
const SHEET = new RegExp(`^states-(${SKIN_RE})\\.png$`)

const [dest] = process.argv.slice(2).filter((a) => !a.startsWith('--'))
if (!dest) throw new Error('usage: collect.mjs <dest>')
const fromAt = process.argv.indexOf('--from')
const from = resolve(fromAt > -1 ? process.argv[fromAt + 1] : 'review-shots')
const out = resolve(dest)
mkdirSync(out, { recursive: true })

const PAGE = { nf: '404' }
let n = 0
for (const route of readdirSync(from, { withFileTypes: true }).filter((d) => d.isDirectory() && !d.name.startsWith('_')).map((d) => d.name)) {
  const page = PAGE[route] ?? route
  for (const f of readdirSync(join(from, route))) {
    let m = SHOT.exec(f)
    if (m) {
      const suffix = m[1] === 'ref-' ? '_ref' : m[1] === 'compare-' ? '_compare' : ''
      copyFileSync(join(from, route, f), join(out, `${page}_${m[2]}_${m[3]}${suffix}.png`))
      n++
      continue
    }
    m = SHEET.exec(f)
    if (m) {
      copyFileSync(join(from, route, f), join(out, `states_${m[1]}_1440.png`))
      n++
      continue
    }
    m = /^ref-(QStates|OStates)\.png$/.exec(f)
    if (m) {
      copyFileSync(join(from, route, f), join(out, `states_${m[1] === 'QStates' ? 'quiet' : 'modern'}_1440_ref.png`))
      n++
    }
  }
}
if (existsSync(join(from, 'audit-all.txt'))) copyFileSync(join(from, 'audit-all.txt'), join(out, 'audit.txt'))
console.log(`${n} files → ${out}`)
