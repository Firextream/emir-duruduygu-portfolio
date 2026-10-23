// Viewport shots of the open style menu in every skin (desktop + mobile), Original's pages sheet,
// and each skin's curtain mid-switch.
//   node scripts/review/menus.mjs [--base http://localhost:3100] [--out review-shots/menus]
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { evaluate, launch, openWithSkin, sleep } from './cdp.mjs'
import { SKINS } from './skins.mjs'

const argv = process.argv.slice(2)
const at = (k) => (argv.indexOf(k) > -1 ? argv[argv.indexOf(k) + 1] : null)
const base = at('--base') || 'http://localhost:3100'
const out = resolve(at('--out') || 'review-shots/menus')
mkdirSync(out, { recursive: true })

const cdp = await launch()
const shot = async (name) => {
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' })
  writeFileSync(join(out, `${name}.png`), Buffer.from(data, 'base64'))
}
const click = (sel) => evaluate(cdp, `(() => { const el = [...document.querySelectorAll(${JSON.stringify(sel)})].find((e) => e.offsetParent !== null); if (!el) return false; el.click(); return true })()`)

try {
  for (const skin of SKINS) {
    for (const width of [1440, 390]) {
      await openWithSkin(cdp, { base, path: '/', skin, width })
      await evaluate(cdp, 'window.scrollTo(0, 0), true')
      const ok = await click('button[aria-controls="style-menu"]')
      await sleep(400)
      if (ok) await shot(`style-${skin}-${width}`)
      process.stdout.write(ok ? '.' : 'x')
    }
  }
  await openWithSkin(cdp, { base, path: '/', skin: 'original', width: 390 })
  if (await click('button[aria-controls="pages-menu"]')) {
    await sleep(400)
    await shot('pages-original-390')
  }
  // curtains: from Quiet, switch to each skin and shoot the leave curtain mid-animation
  for (const skin of SKINS) {
    await openWithSkin(cdp, { base, path: '/', skin: skin === 'quiet' ? 'modern' : 'quiet', width: 1440 })
    await click('button[aria-controls="style-menu"]')
    await sleep(300)
    const label = await evaluate(cdp, `(() => { const b = [...document.querySelectorAll('#style-menu button')].find((e) => e.textContent.trim().toLowerCase().includes(${JSON.stringify(skin === 'soft' ? 'soft club' : skin === 'modern' ? 'modernist' : skin)})); if (!b) return null; b.click(); return b.textContent })()`)
    await sleep(700)
    if (label) await shot(`curtain-${skin}-1440`)
    process.stdout.write(label ? '.' : 'x')
    await sleep(1500)
  }
} finally {
  await cdp.close()
}
console.log(`\n→ ${out}`)
