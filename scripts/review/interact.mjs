// End-to-end behaviour checks against a running site (default http://localhost:3100):
// first visit picks + persists a skin, skin switch (curtain → reload → new skin), Quiet accent persists,
// Quiet player, Soft Club release picker, Modernist contact form, Istanbul clock, Home LCP, console errors.
//   node scripts/review/interact.mjs [--base http://localhost:3100]
import { evaluate, launch, sleep } from './cdp.mjs'
import { SKINS } from './skins.mjs'

const base = process.argv.includes('--base') ? process.argv[process.argv.indexOf('--base') + 1] : 'http://localhost:3100'
const cdp = await launch()
const errors = []
cdp.on('Runtime.exceptionThrown', (p) => errors.push(p.exceptionDetails?.exception?.description || p.exceptionDetails?.text))
cdp.on('Runtime.consoleAPICalled', (p) => {
  if (p.type === 'error' || p.type === 'warning') errors.push(`${p.type}: ${p.args.map((a) => a.value ?? a.description).join(' ')}`)
})
await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })

const results = []
const check = (name, ok, detail = '') => results.push({ name, ok: !!ok, detail })
const go = async (path) => {
  const loaded = cdp.once('Page.loadEventFired', 30000)
  await cdp.send('Page.navigate', { url: new URL(path, base).href })
  await loaded
  await sleep(800)
}
const state = () =>
  evaluate(cdp, `({ skin: document.documentElement.dataset.skin, acc: document.documentElement.dataset.acc,
    stored: localStorage.getItem('duru-style-v2'), cookie: document.cookie })`)
const click = (selector) => evaluate(cdp, `(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return false; el.click(); return true })()`)
const clickText = (selector, text) =>
  evaluate(cdp, `(() => { const el = [...document.querySelectorAll(${JSON.stringify(selector)})].find(e => e.textContent.includes(${JSON.stringify(text)})); if (!el) return false; el.click(); return true })()`)

try {
  // 1. first visit: no cookie, no storage → a skin is picked and both agree
  await cdp.send('Network.clearBrowserCookies')
  await go('/')
  await evaluate(cdp, 'localStorage.clear(), sessionStorage.clear(), true')
  await cdp.send('Network.clearBrowserCookies')
  await go('/')
  let s = await state()
  const stored = JSON.parse(s.stored || 'null')
  check('first visit picks a skin', SKINS.includes(s.skin), s.skin)
  check('first visit persists {skin, acc}', stored && stored.skin === s.skin && stored.acc === 0, s.stored)
  check('cookie mirrors the skin', s.cookie.includes(`duru-skin=${s.skin}`), s.cookie)

  // 2. clock fills in after hydration
  const time = await evaluate(cdp, `[...document.querySelectorAll('time')].map(t => t.textContent).join(' ')`)
  check('Istanbul clock shows HH:MM', /\b\d{2}:\d{2}\b/.test(time), time)

  // 3. force Quiet, pick the Sage accent, reload → still Sage
  await cdp.send('Network.setCookie', { name: 'duru-skin', value: 'quiet', url: base })
  await evaluate(cdp, `localStorage.setItem('duru-style-v2', JSON.stringify({ skin: 'quiet', acc: 0 })), true`)
  await go('/')
  await click('button[aria-controls="style-menu"]')
  await sleep(200)
  await click('button[aria-label="Accent Sage"]')
  await sleep(200)
  s = await state()
  check('accent switch sets data-acc', s.acc === '1', s.acc)
  await go('/')
  s = await state()
  check('accent persists across reload', s.acc === '1' && JSON.parse(s.stored).acc === 1, `${s.acc} ${s.stored}`)

  // 4. Quiet player: pause, next track
  const lcd = () => evaluate(cdp, `document.querySelector('[class*="lcdStatus"]')?.textContent || ''`)
  await click('button[aria-label="Pause"]')
  await sleep(150)
  const paused = await lcd()
  await click('button[aria-label="Next track"]')
  await sleep(150)
  const next = await lcd()
  check('Quiet player pauses', paused.includes('PAUSED'), paused)
  check('Quiet player next track', next.includes('NOW PLAYING') && next.includes('TRK 02'), next)

  // 5. switch skin Quiet → Modernist through the menu: curtain, reload, new skin, accent reset
  await click('button[aria-controls="style-menu"]')
  await sleep(200)
  await clickText('#style-menu button', 'Modernist')
  await sleep(300)
  const curtain = await evaluate(cdp, `!!document.querySelector('[class*="curtain"][class*="leave"]')`)
  check('skin switch shows the curtain', curtain)
  await cdp.once('Page.loadEventFired', 8000)
  await sleep(1200)
  s = await state()
  check('skin switch lands on Modernist', s.skin === 'modern' && JSON.parse(s.stored).skin === 'modern' && JSON.parse(s.stored).acc === 0, `${s.skin} ${s.stored}`)
  const arrived = await evaluate(cdp, `document.documentElement.hasAttribute('data-switching')`)
  check('arrival curtain has faded out', !arrived)

  // 6. Modernist contact form → "Sent ✓"
  await evaluate(cdp, `(() => { const f = document.querySelector('#contact form'); f.querySelector('[name=name]').value = 'Test'; f.querySelector('[name=email]').value = 'test@example.com'; f.querySelector('[name=message]').value = 'Hello from the review script'; f.requestSubmit(); return true })()`)
  // the first POST after a dev-server start compiles the route, so wait for the reply, not a fixed time
  let sent = ''
  for (let t = 0; t < 30 && (!sent || sent.startsWith('Sending')); t++) {
    await sleep(500)
    sent = await evaluate(cdp, `document.querySelector('#contact form button[type=submit]').textContent + ' | ' + document.querySelector('#contact [role=status]').textContent`)
  }
  check('contact form shows the success state', sent.includes('Sent') && sent.includes('✓') && sent.includes("it's in"), sent)

  // 7. Soft Club: pick DD-03 (SLAB-100) → hero swaps
  await cdp.send('Network.setCookie', { name: 'duru-skin', value: 'soft', url: base })
  await evaluate(cdp, `localStorage.setItem('duru-style-v2', JSON.stringify({ skin: 'soft', acc: 0 })), true`)
  await go('/')
  await clickText('button[aria-pressed]', 'SLAB-100')
  await sleep(400)
  const h1 = await evaluate(cdp, `document.querySelector('#release-title').textContent`)
  check('Soft Club release picker swaps the case', h1.includes('SLAB-100'), h1)

  // 8. stale cookie: storage says quiet, cookie says modern → page re-syncs to quiet
  await cdp.send('Network.setCookie', { name: 'duru-skin', value: 'modern', url: base })
  await evaluate(cdp, `localStorage.setItem('duru-style-v2', JSON.stringify({ skin: 'quiet', acc: 2 })), sessionStorage.clear(), true`)
  await go('/')
  await sleep(1500)
  s = await state()
  check('localStorage wins over a stale cookie', s.skin === 'quiet' && s.acc === '2', `${s.skin} acc ${s.acc}`)

  // 9. Home LCP is never a lazy image. Measured directly: Next's dev warning keys images by URL, so it
  // misfires when the hero photo also appears lower on the page (Soft Club's frames shelf).
  const lcpWatch = await cdp.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `window.__lcp=null;new PerformanceObserver((l)=>{for(const e of l.getEntries())window.__lcp=e}).observe({type:'largest-contentful-paint',buffered:true})`,
  })
  for (const skin of SKINS)
    for (const width of [1440, 390]) {
      await cdp.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width <= 760 })
      await cdp.send('Network.setCookie', { name: 'duru-skin', value: skin, url: base })
      await evaluate(cdp, `localStorage.setItem('duru-style-v2', JSON.stringify({ skin: ${JSON.stringify(skin)}, acc: 0 })), sessionStorage.clear(), true`)
      await go('/')
      await sleep(700)
      const lcp = await evaluate(cdp, `(() => { const el = window.__lcp && window.__lcp.element; return el ? { tag: el.tagName, lazy: el.getAttribute('loading') === 'lazy', cls: String(el.className).split('_')[0] } : null })()`)
      check(`${skin} ${width} Home LCP is not lazy`, lcp && !lcp.lazy, lcp ? `${lcp.tag} ${lcp.cls}` : 'no LCP entry')
    }
  await cdp.send('Page.removeScriptToEvaluateOnNewDocument', { identifier: lcpWatch.identifier })
} finally {
  await cdp.close()
}

const relevant = errors.filter((e) => e && !/favicon|Download the React DevTools|detected as the Largest Contentful Paint/i.test(e))
check('no console errors or hydration warnings', relevant.length === 0, relevant.slice(0, 5).join(' || '))
for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  — ${r.detail}` : ''}`)
process.exitCode = results.every((r) => r.ok) ? 0 : 1
