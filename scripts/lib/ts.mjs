// node --experimental-strip-types --import ./scripts/lib/ts.mjs <script> — see ts-resolve.mjs
import { register } from 'node:module'

register('./ts-resolve.mjs', import.meta.url)
