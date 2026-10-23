// State sheets from the running site: each row is one element (nav item, button, list row, dock item,
// photo tile …) in rest / hover / active-or-current, to put next to the QStates / OStates boards and the
// Soft Club README rules. States are forced through the DevTools protocol (CSS.forcePseudoState).
//   node scripts/review/states.mjs [--base http://localhost:3100] [--skins quiet,soft] [--out review-shots/states]
// Output: <out>/states-<skin>.png
import { mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import sharp from 'sharp'
import { evaluate, launch, openWithSkin, sleep } from './cdp.mjs'
import { SKINS } from './skins.mjs'

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true])
    return acc
  }, []),
)
const base = args.base || 'http://localhost:3100'
const out = resolve(args.out || 'review-shots/states')
const skins = (args.skins ? args.skins.split(',') : SKINS).filter((k) => ROWS[k])
mkdirSync(out, { recursive: true })

// finders run in the page and return the element
const q = (sel) => `document.querySelector(${JSON.stringify(sel)})`
const withText = (sel, text) => `[...document.querySelectorAll(${JSON.stringify(sel)})].find((e) => e.textContent.includes(${JSON.stringify(text)}))`
const closest = (find, sel) => `(${find})?.closest(${JSON.stringify(sel)})`

const navCells = (find, width = 1440) => [
  { state: 'rest', path: '/about', width, find },
  { state: 'hover', path: '/about', width, find, force: ['hover'] },
  { state: 'active (current page)', path: '/gallery', width, find },
]
const NAV = q('nav[aria-label="Main"] a[href="/gallery"]')
const DOCK = q('nav[aria-label="Main (mobile)"] a[href="/gallery"]')
// pressing implies hovering, so the third column forces both (the boards draw it that way)
const rha = (path, find, width = 1440, third = ['hover', 'active']) => [
  { state: 'rest', path, width, find },
  { state: 'hover', path, width, find, force: ['hover'] },
  { state: third.includes('active') ? 'active / pressed' : third.join(' + '), path, width, find, force: third },
]
const rh = (path, find, width = 1440) => rha(path, find, width).slice(0, 2)

const ROWS = {
  quiet: [
    { label: 'Top-bar nav', cells: navCells(NAV) },
    { label: 'Mobile dock', cells: navCells(DOCK, 390) },
    { label: 'Button', cells: rha('/blog', withText('a[href="#journal-list"]', 'archive')) },
    { label: 'Window / panel', cells: rh('/', closest(withText('section span', 'journal.txt'), 'section')) },
    { label: 'List row', cells: rh('/', q('a[href^="/blog/"]')) },
    { label: 'Photo print', cells: rh('/', q('a[href^="/gallery/"]')) },
  ],
  modern: [
    { label: 'Nav item', cells: navCells(NAV) },
    { label: 'Primary button', cells: rha('/', q('#contact form button[type=submit]')) },
    { label: 'Text link', cells: rha('/', withText('a', 'All photographs')) },
    { label: 'List row', cells: rha('/', q('a[href^="/blog/"]')) },
    { label: 'Text field', cells: rha('/', q('#contact form input[name=email]'), 1440, ['focus', 'focus-visible']) },
    { label: 'Mobile dock', cells: navCells(DOCK, 390) },
    { label: 'Photo frame', cells: rha('/gallery', q('a[href^="/gallery/"]')) },
  ],
  soft: [
    { label: 'Nav item', cells: navCells(NAV) },
    { label: 'Filter chip', cells: [...rh('/blog', withText('button[aria-pressed]', 'Essays')), { state: 'pressed (selected)', path: '/blog', width: 1440, find: q('[role=group] button[aria-pressed="true"]') }] },
    { label: 'Aqua button', cells: rha('/blog/long-title', withText('a', 'newer').replace('newer', 'newer')) },
    { label: 'List row', cells: rh('/blog', q('a[href^="/blog/"]:not([class*="featured"])')) },
    { label: 'Photo tile', cells: rh('/gallery', q('a[href^="/gallery/"]')) },
    { label: 'Mobile dock', cells: navCells(DOCK, 390) },
  ],
}
// Soft Club's aqua button: the footer mail button is on every page
ROWS.soft[2] = { label: 'Aqua button', cells: rha('/about', withText('a[href^="mailto:"]', '@')) }

const PAD = 18
const cdp = await launch()
await cdp.send('DOM.enable')
await cdp.send('CSS.enable')

async function shoot(skin, cell) {
  await openWithSkin(cdp, { base, path: cell.path, skin, width: cell.width })
  await sleep(300)
  const found = await evaluate(cdp, `(() => { const el = ${cell.find}; if (!el) return false; el.setAttribute('data-state-target', ''); el.scrollIntoView({ block: 'center' }); return true })()`)
  if (!found) return null
  await sleep(250)
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 })
  const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: '[data-state-target]' })
  if (cell.force) await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: cell.force })
  await sleep(350)
  // clip is in document coordinates; a fixed or sticky element (the mobile dock) is shot without capturing beyond
  // the viewport, which would resize the viewport and move the element to the bottom of the full page
  const r = await evaluate(cdp, `(() => { const el = document.querySelector('[data-state-target]'); let fixed = false; for (let n = el; n && n !== document.body; n = n.parentElement) if (['fixed', 'sticky'].includes(getComputedStyle(n).position)) fixed = true; const b = el.getBoundingClientRect(); return { fixed, x: b.left + scrollX, y: b.top + scrollY, w: b.width, h: b.height } })()`)
  const clip = { x: Math.max(0, r.x - PAD), y: Math.max(0, r.y - PAD), width: Math.min(r.w + PAD * 2, cell.width), height: r.h + PAD * 2, scale: 1 }
  const shot = await cdp.send('Page.captureScreenshot', { format: 'png', clip, captureBeyondViewport: !r.fixed })
  if (cell.force) await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [] })
  return Buffer.from(shot.data, 'base64')
}

const label = (text, w, h, size = 13, weight = 600) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><text x="0" y="${size + 2}" font-family="Segoe UI, Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="#3a3a3a">${text.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text></svg>`,
  )

try {
  for (const skin of skins) {
    const rows = []
    for (const row of ROWS[skin]) {
      const cells = []
      for (const cell of row.cells) cells.push({ state: cell.state, png: await shoot(skin, cell) })
      rows.push({ label: row.label, cells })
      process.stdout.write('.')
    }
    // compose: label column + one column per state
    const LABEL_W = 170
    const GAP = 28
    const metas = await Promise.all(rows.flatMap((r) => r.cells.map((c) => (c.png ? sharp(c.png).metadata() : { width: 160, height: 40 }))))
    let k = 0
    const colW = Math.max(...metas.map((m) => m.width))
    const layers = []
    let y = 24
    for (const row of rows) {
      const hs = row.cells.map(() => metas[k++].height)
      const rowH = Math.max(...hs) + 26
      layers.push({ input: label(row.label, LABEL_W, 20), left: 24, top: y + PAD })
      row.cells.forEach((c, i) => {
        const left = 24 + LABEL_W + i * (colW + GAP)
        if (c.png) layers.push({ input: c.png, left, top: y })
        else layers.push({ input: label('[not found]', colW, 20, 12, 400), left, top: y + PAD })
        layers.push({ input: label(c.state, colW, 20, 12, 400), left, top: y + rowH - 22 })
      })
      y += rowH + 24
    }
    const width = 24 + LABEL_W + 3 * (colW + GAP)
    await sharp({ create: { width, height: y + 12, channels: 3, background: '#ffffff' } })
      .composite(layers)
      .png()
      .toFile(join(out, `states-${skin}.png`))
    console.log(` ${skin}`)
  }
} finally {
  await cdp.close()
}
