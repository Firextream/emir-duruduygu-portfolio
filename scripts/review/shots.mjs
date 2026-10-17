// Full-page screenshots of every route × skin × width, next to the matching design reference.
//
//   node scripts/review/shots.mjs [--base http://localhost:3100] [--routes home,post] [--skins quiet,modern]
//                                 [--widths 390,1440] [--ref] [--site] [--out review-shots]
//
// --ref   capture design_handoff_duruduygu/Duruduygu.dc.html (over file://)
// --site  capture the running site (default when neither flag is given: both)
// Output: <out>/<route>/<skin>-<width>.png and <out>/<route>/ref-<skin>-<width>.png
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { evaluate, fullPageShot, launch, openWithSkin, settle, sleep } from './cdp.mjs'
import { ROUTES } from './routes.mjs'

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true])
    return acc
  }, []),
)

const base = args.base || 'http://localhost:3100'
const out = resolve(args.out || 'review-shots')
const routes = (args.routes || Object.keys(ROUTES).join(',')).split(',')
const skins = (args.skins || 'quiet,soft,modern').split(',')
const widths = (args.widths || '390,1440').split(',').map(Number)
const doRef = args.ref || !args.site
const doSite = args.site || !args.ref
const refFile = pathToFileURL(resolve('design_handoff_duruduygu/Duruduygu.dc.html')).href

const cdp = await launch({ extraArgs: ['--allow-file-access-from-files'] })
let n = 0
try {
  for (const route of routes) {
    const def = ROUTES[route]
    if (!def) throw new Error(`unknown route ${route}`)
    mkdirSync(join(out, route), { recursive: true })
    for (const skin of skins) {
      for (const width of widths) {
        if (doSite && !(route === 'journal-empty' && !args.empty)) {
          await openWithSkin(cdp, { base, path: def.path, skin, width })
          writeFileSync(join(out, route, `${skin}-${width}.png`), await fullPageShot(cdp, width))
          n++
        }
        if (doRef) {
          await cdp.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width <= 760 })
          const { page, arg = 0, empty = false } = def.ref
          const review = JSON.stringify({ page, arg, empty, dev: width <= 760 ? 'mobile' : 'desktop' })
          const pre = await cdp.send('Page.addScriptToEvaluateOnNewDocument', {
            source: `try{localStorage.setItem('duru-style-v2',JSON.stringify({skin:${JSON.stringify(skin)},mode:'light',acc:0}));localStorage.setItem('duru-review-v2',${JSON.stringify(review)})}catch(e){}`,
          })
          const hash = empty ? '' : page === 'home' ? '#/' : `#/${page}${arg ? '/' + arg : ''}`
          const loaded = cdp.once('Page.loadEventFired', 30000)
          await cdp.send('Page.navigate', { url: `${refFile}?r=${Date.now()}${hash}` })
          await loaded
          await settle(cdp, 2500)
          await evaluate(cdp, 'document.fonts.ready.then(() => true)')
          await sleep(500)
          writeFileSync(join(out, route, `ref-${skin}-${width}.png`), await fullPageShot(cdp, width))
          await cdp.send('Page.removeScriptToEvaluateOnNewDocument', { identifier: pre.identifier })
          n++
        }
        process.stdout.write('.')
      }
    }
  }
} finally {
  await cdp.close()
}
console.log(`\n${n} screenshots → ${out}`)
