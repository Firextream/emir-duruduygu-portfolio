// Full-page shots of standalone design sheets (QStates, OStates, …) at 1440, over file://.
//   node scripts/review/boards.mjs QStates OStates [--out review-shots/states]
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { evaluate, fullPageShot, launch, settle, sleep } from './cdp.mjs'

const argv = process.argv.slice(2)
const outAt = argv.indexOf('--out')
const out = resolve(outAt > -1 ? argv[outAt + 1] : 'review-shots/states')
const names = argv.filter((a, i) => !a.startsWith('--') && (outAt < 0 || i !== outAt + 1))
mkdirSync(out, { recursive: true })

const cdp = await launch({ extraArgs: ['--allow-file-access-from-files'] })
try {
  for (const name of names) {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
    const loaded = cdp.once('Page.loadEventFired', 30000)
    await cdp.send('Page.navigate', { url: pathToFileURL(resolve(`design_handoff_duruduygu/${name}.dc.html`)).href })
    await loaded
    await settle(cdp, 2500)
    await evaluate(cdp, 'document.fonts.ready.then(() => true)')
    await sleep(400)
    writeFileSync(join(out, `ref-${name}.png`), await fullPageShot(cdp, 1440))
    console.log(name)
  }
} finally {
  await cdp.close()
}
