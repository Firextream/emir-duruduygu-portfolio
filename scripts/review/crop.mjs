// A full-resolution side-by-side of one band of a page (reference left, site right) for detail checks.
//   node scripts/review/crop.mjs <route> <skin> <width> <top> <height> [--out review-shots]
// Output: <out>/<route>/crop-<skin>-<width>-<top>.png
import { join, resolve } from 'node:path'
import sharp from 'sharp'

const [route, skin, width, top, height] = process.argv.slice(2)
if (!height) throw new Error('usage: crop.mjs <route> <skin> <width> <top> <height>')
const outArg = process.argv.indexOf('--out')
const dir = join(resolve(outArg > -1 ? process.argv[outArg + 1] : 'review-shots'), route)
const band = async (file) => {
  const meta = await sharp(file).metadata()
  const t = Math.min(Number(top), meta.height - 1)
  return sharp(file).extract({ left: 0, top: t, width: meta.width, height: Math.min(Number(height), meta.height - t) }).png().toBuffer({ resolveWithObject: true })
}
const [a, b] = await Promise.all([band(join(dir, `ref-${skin}-${width}.png`)), band(join(dir, `${skin}-${width}.png`))])
const gap = 24
const file = join(dir, `crop-${skin}-${width}-${top}.png`)
await sharp({ create: { width: a.info.width + b.info.width + gap, height: Math.max(a.info.height, b.info.height), channels: 3, background: '#cfcbc6' } })
  .composite([
    { input: a.data, left: 0, top: 0 },
    { input: b.data, left: a.info.width + gap, top: 0 },
  ])
  .png()
  .toFile(file)
console.log(file)
