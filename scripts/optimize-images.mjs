// Prepares photos in the repo for the site: at most 2560 px on the long edge, quality 82, upright,
// no EXIF (so no GPS position), colour profile kept. Files keep their name and format, so content/
// references stay valid. A file is only rewritten when it needs it — bigger than 2560 px, carries
// GPS data or an EXIF rotation — so nothing gets recompressed twice.
//
//   npm run images                       public/content (what Keystatic writes to)
//   npm run images -- path/a.jpg dir/    only these files or folders
//   npm run images -- --check            change nothing; exit 1 if a file needs work (for CI)
//   npm run images -- --force            rewrite every file (strips EXIF, recompresses)
//
// Images uploaded through Keystatic in production go straight to GitHub: pull, run this, commit.
import { readdirSync, readFileSync, renameSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import sharp from 'sharp'

const MAX = 2560
const QUALITY = 82
const FORMATS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])

// each file is read into memory first: on Windows a file sharp still holds open can't be replaced
sharp.cache(false)

const args = process.argv.slice(2)
const check = args.includes('--check')
const force = args.includes('--force')
const targets = args.filter((a) => !a.startsWith('--'))

function* files(path) {
  if (statSync(path).isDirectory()) {
    for (const e of readdirSync(path)) yield* files(join(path, e))
  } else if (FORMATS.has(extname(path).toLowerCase())) yield path
}

/** Does the EXIF block (as sharp returns it: "Exif\0\0" + TIFF) point to a GPS directory? */
function hasGps(exif) {
  if (!exif || exif.length < 14) return false
  const tiff = exif.subarray(exif.toString('latin1', 0, 4) === 'Exif' ? 6 : 0)
  const le = tiff.toString('latin1', 0, 2) === 'II'
  const u16 = (o) => (le ? tiff.readUInt16LE(o) : tiff.readUInt16BE(o))
  const u32 = (o) => (le ? tiff.readUInt32LE(o) : tiff.readUInt32BE(o))
  try {
    const ifd0 = u32(4)
    const count = u16(ifd0)
    for (let i = 0; i < count; i++) if (u16(ifd0 + 2 + i * 12) === 0x8825) return true // GPSInfo
  } catch {
    return true // unreadable EXIF: rewrite to be safe
  }
  return false
}

function encoder(img, ext) {
  switch (ext) {
    case '.png':
      return img.png({ compressionLevel: 9 }) // lossless; quality doesn't apply
    case '.webp':
      return img.webp({ quality: QUALITY })
    case '.avif':
      return img.avif({ quality: QUALITY })
    default:
      return img.jpeg({ quality: QUALITY, mozjpeg: true })
  }
}

const kb = (n) => `${Math.round(n / 1024)} KB`
let todo = 0
let total = 0
let saved = 0

for (const target of targets.length ? targets : ['public/content']) {
  for (const file of files(target)) {
    const input = readFileSync(file)
    const before = input.length
    total += before
    const meta = await sharp(input).metadata()
    const rotated = (meta.orientation ?? 1) > 1
    const [w, h] = rotated && meta.orientation >= 5 ? [meta.height, meta.width] : [meta.width, meta.height]
    const reasons = [
      Math.max(w, h) > MAX && `${w}×${h} > ${MAX}px`,
      hasGps(meta.exif) && 'GPS in EXIF',
      rotated && `EXIF rotation ${meta.orientation}`,
      force && 'forced',
    ].filter(Boolean)
    if (!reasons.length) continue
    todo++
    const name = relative('.', file).replace(/\\/g, '/')
    if (check) {
      console.log(`needs work  ${name} — ${reasons.join(', ')}`)
      continue
    }
    const tmp = `${file}.tmp${extname(file)}`
    const img = sharp(input)
      .rotate() // upright from the EXIF orientation; the output carries no EXIF at all
      .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
      .keepIccProfile()
    const out = await encoder(img, extname(file).toLowerCase()).toFile(tmp)
    renameSync(tmp, file)
    const after = statSync(file).size
    saved += before - after
    total += after - before
    console.log(`done        ${name} — ${reasons.join(', ')} → ${out.width}×${out.height}, ${kb(before)} → ${kb(after)}`)
  }
}

console.log(`\n${todo ? `${todo} file(s) ${check ? 'need work' : 'rewritten'}` : 'Nothing to do'}. Images in the repo: ${(total / 1024 / 1024).toFixed(1)} MB${saved > 0 ? ` (${kb(saved)} saved)` : ''}.`)
if (total > 300 * 1024 * 1024) console.log('Over 300 MB of images in the repo: plan the move to Cloudflare R2 (GO_LIVE.md, "Images").')
if (check && todo) process.exit(1)
