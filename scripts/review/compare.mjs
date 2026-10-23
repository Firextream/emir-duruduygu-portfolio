// Puts each site screenshot next to its reference: <out>/<route>/compare-<skin>-<width>.png
// (reference left, site right). Run after shots.mjs.   node scripts/review/compare.mjs [--out review-shots]
import { existsSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import sharp from 'sharp'
import { SKIN_RE } from './skins.mjs'

const SITE_SHOT = new RegExp(`^(${SKIN_RE})-\\d+\\.png$`)

const outArg = process.argv.indexOf('--out')
const out = resolve(outArg > -1 ? process.argv[outArg + 1] : 'review-shots')
let n = 0
for (const route of readdirSync(out, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)) {
  const dir = join(out, route)
  for (const file of readdirSync(dir).filter((f) => SITE_SHOT.test(f))) {
    const ref = join(dir, `ref-${file}`)
    if (!existsSync(ref)) continue
    const [a, b] = await Promise.all([sharp(ref).metadata(), sharp(join(dir, file)).metadata()])
    const gap = 24
    const height = Math.max(a.height, b.height)
    await sharp({ create: { width: a.width + b.width + gap, height, channels: 3, background: '#cfcbc6' } })
      .composite([
        { input: ref, left: 0, top: 0 },
        { input: join(dir, file), left: a.width + gap, top: 0 },
      ])
      .png({ compressionLevel: 9 })
      .toFile(join(dir, `compare-${file}`))
    n++
  }
}
console.log(`${n} comparison(s) → ${out}`)
