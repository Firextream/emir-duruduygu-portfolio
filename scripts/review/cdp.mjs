// Minimal Chrome DevTools Protocol driver (Node 22: built-in fetch + WebSocket, no dependencies).
// Used by shots.mjs and audit.mjs to render pages at exact widths in headless Chrome.
import { spawn } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME_PATHS = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export async function launch({ extraArgs = [] } = {}) {
  const chromePath = CHROME_PATHS.find((p) => existsSync(p))
  if (!chromePath) throw new Error('Chrome not found — set CHROME_PATH')
  const port = 9400 + Math.floor(Math.random() * 400)
  const profile = join(tmpdir(), `duru-review-${port}`)
  const proc = spawn(
    chromePath,
    ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--hide-scrollbars', '--no-first-run', ...extraArgs, 'about:blank'],
    { stdio: 'ignore' },
  )
  for (let i = 0; i < 100; i++) {
    try {
      await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()
      break
    } catch {
      await sleep(150)
    }
  }
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
  const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl)
  await new Promise((r) => ws.addEventListener('open', r))
  let id = 0
  const pending = new Map()
  const listeners = new Map()
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data)
    if (m.id && pending.has(m.id)) {
      const { resolve, reject } = pending.get(m.id)
      pending.delete(m.id)
      m.error ? reject(new Error(`${m.error.message}`)) : resolve(m.result)
    } else if (m.method && listeners.has(m.method)) {
      for (const fn of listeners.get(m.method)) fn(m.params)
    }
  })
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const i = ++id
      pending.set(i, { resolve, reject })
      ws.send(JSON.stringify({ id: i, method, params }))
    })
  const on = (method, fn) => {
    if (!listeners.has(method)) listeners.set(method, new Set())
    listeners.get(method).add(fn)
    return () => listeners.get(method).delete(fn)
  }
  const once = (method, timeout = 15000) =>
    new Promise((resolve) => {
      const t = setTimeout(() => (off(), resolve(null)), timeout)
      const off = on(method, (p) => (clearTimeout(t), off(), resolve(p)))
    })
  await send('Page.enable')
  await send('Runtime.enable')
  await send('Network.enable')
  const close = async () => {
    ws.close()
    proc.kill()
    await sleep(400)
    try {
      rmSync(profile, { recursive: true, force: true })
    } catch {
      // profile still locked on Windows — harmless
    }
  }
  return { send, on, once, close }
}

export async function evaluate(cdp, expression) {
  const r = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || 'evaluate failed')
  return r.result.value
}

/** Waits for load, fonts and images, plus a settle delay. */
export async function settle(cdp, extra = 600) {
  await evaluate(
    cdp,
    `(async () => {
      if (document.readyState !== 'complete') await new Promise(r => addEventListener('load', r, { once: true }));
      await document.fonts.ready;
      await Promise.all([...document.images].filter(i => !i.complete && i.loading !== 'lazy').map(i => new Promise(r => { i.onload = i.onerror = r })));
      return true;
    })()`,
  ).catch(() => {})
  await sleep(extra)
}

/** Navigates with a skin preset (cookie for the server, localStorage for the client). */
export async function openWithSkin(cdp, { base, path, skin, width, height = 900, mobile }) {
  await cdp.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: mobile ?? width <= 760 })
  const origin = new URL(base)
  await cdp.send('Network.setCookie', { name: 'duru-skin', value: skin, domain: origin.hostname, path: '/' })
  const script = await cdp.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `try{localStorage.setItem('duru-style-v2',JSON.stringify({skin:${JSON.stringify(skin)},acc:0}));sessionStorage.clear()}catch(e){}`,
  })
  const loaded = cdp.once('Page.loadEventFired', 30000)
  await cdp.send('Page.navigate', { url: new URL(path, base).href })
  await loaded
  await settle(cdp)
  await cdp.send('Page.removeScriptToEvaluateOnNewDocument', { identifier: script.identifier })
}

export async function fullPageShot(cdp, width, mobile) {
  const h = await evaluate(cdp, 'Math.ceil(Math.max(document.documentElement.scrollHeight, document.body.scrollHeight))')
  const height = Math.min(16000, h || 900)
  await cdp.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: mobile ?? width <= 760 })
  // let lazy images inside the now-visible area load
  await evaluate(cdp, `Promise.all([...document.images].filter(i => !i.complete).map(i => new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 4000) })))`).catch(() => {})
  await sleep(500)
  const shot = await cdp.send('Page.captureScreenshot', { format: 'png' })
  return Buffer.from(shot.data, 'base64')
}
