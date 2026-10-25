// Checks content/ the way the site reads it (lib/content/files): every entry reads, every image file
// exists, every photo:/cover/home-photo reference points at a real photo.
//   npm run check:content                exit 1 on any problem
//   npm run check:content -- --parity    also compare every getter with lib/content/mock
//                                        (identical right after the migration from the mock data)
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const problems = []
const logged = console.error
console.error = (...args) => problems.push(args.map(String).join(' ')) // the adapter logs what it skips

const { filesAdapter } = await import('../lib/content/files/index.ts')
const [photos, mood, posts, projects, about, settings] = await Promise.all([
  filesAdapter.photos(),
  filesAdapter.mood(),
  filesAdapter.posts(),
  filesAdapter.projects(),
  filesAdapter.about(),
  filesAdapter.settings(),
])
console.error = logged

// every file became an entry
const files = (dir, ext) => readdirSync(join('content', dir)).filter((f) => f.endsWith(ext))
for (const [dir, ext, list] of [
  ['photos', '.yaml', photos],
  ['mood', '.yaml', mood],
  ['posts', '.md', posts],
  ['projects', '.md', projects],
]) {
  const n = files(dir, ext).length
  if (n !== list.length) problems.push(`content/${dir}: ${n} files but ${list.length} entries read`)
}

// references
const ids = new Set(photos.map((p) => p.id))
const refs = (text, where) => {
  for (const m of text.matchAll(/photo:([A-Za-z0-9_-]+)/g)) if (!ids.has(m[1])) problems.push(`${where}: photo:${m[1]} isn't a photo`)
}
for (const f of files('posts', '.md')) refs(readFileSync(join('content/posts', f), 'utf8'), `content/posts/${f}`)
for (const f of files('projects', '.md')) refs(readFileSync(join('content/projects', f), 'utf8'), `content/projects/${f}`)
refs(readFileSync('content/about.yaml', 'utf8'), 'content/about.yaml')
for (const f of files('posts', '.md')) {
  const cover = /^cover: (\S+)$/m.exec(readFileSync(join('content/posts', f), 'utf8'))?.[1]
  if (cover && !ids.has(cover)) problems.push(`content/posts/${f}: cover ${cover} isn't a photo`)
}
for (const [skin, id] of Object.entries(settings.homePhoto)) {
  if (id && !ids.has(id)) problems.push(`content/settings.yaml: home photo for ${skin} (${id}) isn't a photo`)
}

const real = photos.filter((p) => p.image).length
console.log(
  `photos ${photos.length} (${real} with an image) · mood ${mood.length} · posts ${posts.length} · projects ${projects.length} · ` +
    `milestones ${about.milestones.length}`,
)

if (process.argv.includes('--parity')) {
  const { mockAdapter } = await import('../lib/content/mock/index.ts')
  // key order doesn't matter; undefined keys are the same as missing ones
  const canon = (v) =>
    Array.isArray(v)
      ? v.map(canon)
      : v && typeof v === 'object'
        ? Object.fromEntries(Object.keys(v).filter((k) => v[k] !== undefined).sort().map((k) => [k, canon(v[k])]))
        : v
  const diff = (a, b, at, out) => {
    if (JSON.stringify(a) === JSON.stringify(b)) return
    if (a && b && typeof a === 'object' && typeof b === 'object') {
      for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diff(a[k], b[k], `${at}.${k}`, out)
    } else out.push(`${at}: files ${JSON.stringify(a)?.slice(0, 80)} ≠ mock ${JSON.stringify(b)?.slice(0, 80)}`)
  }
  const files = { photos, mood, posts, projects, about, settings }
  for (const key of Object.keys(files)) {
    const out = []
    diff(canon(files[key]), canon(await mockAdapter[key]()), key, out)
    console.log(`parity ${key}: ${out.length ? `${out.length} difference(s)` : 'identical'}`)
    problems.push(...out)
  }
}

if (problems.length) {
  console.log(`\n${problems.length} problem(s):\n- ${problems.join('\n- ')}`)
  process.exit(1)
}
console.log('content OK')
