// The skin ids, read from the registry in lib/skins.ts so the review scripts follow it.
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const source = readFileSync(resolve('lib/skins.ts'), 'utf8')
const body = source.slice(source.indexOf('export const SKIN_REGISTRY = {'), source.indexOf('} as const satisfies'))
export const SKINS = [...body.matchAll(/^ {2}(\w+): \{$/gm)].map((m) => m[1])
if (!SKINS.length) throw new Error('no skins found in lib/skins.ts')

/** regex alternation of the skin ids, for file names like <skin>-<width>.png */
export const SKIN_RE = SKINS.join('|')
