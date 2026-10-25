// The part of probe-image-size the files adapter uses (it ships no types).
declare module 'probe-image-size' {
  import type { Readable } from 'node:stream'

  interface ProbeResult {
    width: number
    height: number
    type: string
    mime: string
    /** EXIF orientation (1–8), when the file has one */
    orientation?: number
  }

  function probe(source: Readable | string): Promise<ProbeResult>
  export default probe
}
