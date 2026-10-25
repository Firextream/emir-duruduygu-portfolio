// Lets plain Node (22, --experimental-strip-types) import the site's TypeScript modules from scripts:
// resolves the @/ alias and extensionless relative imports to .ts / .tsx / index.ts files.
// Registered by ./ts.mjs:   node --experimental-strip-types --import ./scripts/lib/ts.mjs <script>
import { existsSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('../../', import.meta.url))
const TRY = ['', '.ts', '.tsx', '/index.ts', '/index.tsx']

function find(base) {
  for (const suffix of TRY) {
    const file = base + suffix
    if (existsSync(file) && statSync(file).isFile()) return file
  }
  return null
}

export async function resolve(specifier, context, next) {
  // Next.js resolves this marker package itself; outside Next it only has to load
  if (specifier === 'server-only') return { url: 'data:text/javascript,', shortCircuit: true }
  const parent = context.parentURL?.startsWith('file:') ? fileURLToPath(context.parentURL) : null
  let base = null
  if (specifier.startsWith('@/')) base = path.join(root, specifier.slice(2))
  else if (/^\.\.?\//.test(specifier) && parent && !parent.includes(`${path.sep}node_modules${path.sep}`)) {
    base = path.resolve(path.dirname(parent), specifier)
  }
  const file = base && find(base)
  return file ? { url: pathToFileURL(file).href, shortCircuit: true } : next(specifier, context)
}
