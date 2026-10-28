// Prepares photos in the repo for the site: at most 2560 px on the long edge, quality 82, upright,
// colour profile kept. EXIF keeps only the camera fields — Make, Model, LensModel, FocalLength,
// FNumber, ExposureTime, ISO, DateTimeOriginal — with Orientation 1; GPS, serial numbers, the
// MakerNote, the thumbnail and everything else are dropped (scripts/lib/exif.mjs). Files keep their
// name and format, so content/ references stay valid. A file is only rewritten when it needs it —
// bigger than 2560 px, or EXIF beyond those fields or a rotation — so nothing is recompressed twice.
//
// The site never reads EXIF: captions come from the photo's fields in content/ (camera, date, place).
//
//   npm run images                       public/content (what Keystatic writes to)
//   npm run images -- path/a.jpg dir/    only these files or folders
//   npm run images -- --check            change nothing; exit 1 if a file needs work (for CI)
//   npm run images -- --force            rewrite every file (recompresses)
//
// Images uploaded through Keystatic in production go straight to GitHub: pull, run this, commit.
import { readdirSync, readFileSync, renameSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import sharp from 'sharp'
import { exifProblems, readExif } from './lib/exif.mjs'

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
    const exif = readExif(meta.exif)
    const [w, h] = (meta.orientation ?? 1) >= 5 ? [meta.height, meta.width] : [meta.width, meta.height]
    const reasons = [Math.max(w, h) > MAX && `${w}×${h} > ${MAX}px`, ...exifProblems(exif), force && 'forced'].filter(Boolean)
    if (!reasons.length) continue
    todo++
    const name = relative('.', file).replace(/\\/g, '/')
    if (check) {
      console.log(`needs work  ${name} — ${reasons.join(', ')}`)
      continue
    }
    const tmp = `${file}.tmp${extname(file)}`
    let img = sharp(input)
      .rotate() // upright from the EXIF orientation, so the output's Orientation is 1
      .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
      .keepIccProfile()
    // only the allowed fields are written; without any, the file carries no EXIF at all
    const keep = Object.keys(exif.keep.IFD0).length + Object.keys(exif.keep.IFD2).length
    if (keep) img = img.withExif({ IFD0: { ...exif.keep.IFD0, Orientation: '1' }, IFD2: exif.keep.IFD2 })
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
