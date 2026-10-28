// A small EXIF (TIFF) reader for scripts/optimize-images.mjs and its test: the fields we keep, plus
// what must go (GPS, serial numbers, MakerNote, the embedded thumbnail, anything else).
// Input: the EXIF block as sharp's metadata() returns it ("Exif\0\0" + TIFF) or a bare TIFF.

/** What may stay in a published photo, by IFD. Names are sharp/libexif's (withExif keys). */
export const KEEP = {
  IFD0: { 0x010f: 'Make', 0x0110: 'Model' },
  EXIF: {
    0x829a: 'ExposureTime',
    0x829d: 'FNumber',
    0x8827: 'ISOSpeedRatings',
    0x9003: 'DateTimeOriginal',
    0x920a: 'FocalLength',
    0xa434: 'LensModel',
  },
}

const ORIENTATION = 0x0112
const EXIF_POINTER = 0x8769
const GPS_POINTER = 0x8825
const INTEROP_POINTER = 0xa005

/**
 * Tags libvips writes on its own whenever it saves EXIF (checked for JPEG, WebP, AVIF and PNG):
 * X/YResolution, ResolutionUnit, YCbCrPositioning, ExifVersion, ComponentsConfiguration,
 * FlashpixVersion, ColorSpace, PixelX/YDimension. Technical, nothing personal.
 */
const WRITER_TAGS = new Set([0x011a, 0x011b, 0x0128, 0x0213, 0x9000, 0x9101, 0xa000, 0xa001, 0xa002, 0xa003])

/** Names for the tags worth naming in a report. */
const NAMES = {
  0x927c: 'MakerNote',
  0xa431: 'BodySerialNumber',
  0xa435: 'LensSerialNumber',
  0xc62f: 'CameraSerialNumber',
  0x9c9b: 'XPTitle',
  0x013b: 'Artist',
  0x8298: 'Copyright',
  0x0131: 'Software',
  0x9286: 'UserComment',
  0x010e: 'ImageDescription',
}

const SIZE = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 6: 1, 7: 1, 8: 2, 9: 4, 10: 8, 11: 4, 12: 8 }

/**
 * @returns {{ keep: { IFD0: Record<string,string>, IFD2: Record<string,string> }, orientation: number,
 *   gps: boolean, thumbnail: boolean, extra: string[] }}
 *   keep: the allowed fields as sharp withExif strings ("1/250", "200", "2026:03:14 10:22:01")
 *   extra: everything else that is in the file and shouldn't be (names or hex tag ids)
 */
export function readExif(block) {
  const out = { keep: { IFD0: {}, IFD2: {} }, orientation: 1, gps: false, thumbnail: false, extra: [] }
  if (!block || block.length < 8) return out
  const tiff = block.subarray(block.toString('latin1', 0, 4) === 'Exif' ? 6 : 0)
  const le = tiff.toString('latin1', 0, 2) === 'II'
  const u16 = (o) => (le ? tiff.readUInt16LE(o) : tiff.readUInt16BE(o))
  const u32 = (o) => (le ? tiff.readUInt32LE(o) : tiff.readUInt32BE(o))

  const entries = (offset) => {
    const list = []
    const n = u16(offset)
    for (let i = 0; i < n; i++) {
      const at = offset + 2 + i * 12
      const type = u16(at + 2)
      const count = u32(at + 4)
      const bytes = (SIZE[type] ?? 1) * count
      list.push({ tag: u16(at), type, count, data: bytes <= 4 ? at + 8 : u32(at + 8) })
    }
    return { list, next: u32(offset + 2 + n * 12) }
  }

  const value = (e) => {
    if (e.type === 2) return tiff.toString('latin1', e.data, e.data + e.count).replace(/\0+$/, '').trim()
    if (e.type === 3) return String(u16(e.data))
    if (e.type === 4) return String(u32(e.data))
    if (e.type === 5 || e.type === 10) return `${u32(e.data)}/${u32(e.data + 4)}`
    return null
  }

  const name = (tag) => NAMES[tag] ?? `0x${tag.toString(16).padStart(4, '0')}`

  try {
    const ifd0 = entries(u32(4))
    for (const e of ifd0.list) {
      if (KEEP.IFD0[e.tag]) {
        const v = value(e)
        if (v) out.keep.IFD0[KEEP.IFD0[e.tag]] = v
      } else if (e.tag === ORIENTATION) out.orientation = Number(value(e)) || 1
      else if (e.tag === GPS_POINTER) out.gps = true
      else if (e.tag === EXIF_POINTER) {
        for (const x of entries(u32(e.data)).list) {
          if (KEEP.EXIF[x.tag]) {
            const v = value(x)
            if (v) out.keep.IFD2[KEEP.EXIF[x.tag]] = v
          } else if (x.tag === INTEROP_POINTER) out.extra.push('Interoperability')
          else if (!WRITER_TAGS.has(x.tag)) out.extra.push(name(x.tag))
        }
      } else if (!WRITER_TAGS.has(e.tag)) out.extra.push(name(e.tag))
    }
    if (ifd0.next) out.thumbnail = true // IFD1: the embedded thumbnail
  } catch {
    out.extra.push('unreadable EXIF')
  }
  return out
}

/** Does this EXIF block hold anything beyond the allowed fields and an upright orientation? */
export function exifProblems(info) {
  return [info.gps && 'GPS', info.thumbnail && 'thumbnail', ...info.extra, info.orientation > 1 && `EXIF rotation ${info.orientation}`].filter(Boolean)
}
