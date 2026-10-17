// Layout audit for every route × skin at 320 / 390 / 768 / 1024 / 1280 / 1440, fresh and cached loads.
// Fails on: horizontal page scroll, overlapping text, text < 11px, mobile hit targets < 44px,
// images without `sizes`, and photos rendered at a different ratio than their file (cropping).
//
//   node scripts/review/audit.mjs [--base http://localhost:3100] [--routes home,post] [--skins quiet]
//                                 [--widths 320,390,768,1024,1280,1440] [--json out.json]
import { writeFileSync } from 'node:fs'
import { evaluate, launch, openWithSkin, sleep } from './cdp.mjs'
import { ROUTES } from './routes.mjs'

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true])
    return acc
  }, []),
)
const base = args.base || 'http://localhost:3100'
const routes = (args.routes || Object.keys(ROUTES).filter((r) => r !== 'journal-empty').join(',')).split(',')
const skins = (args.skins || 'quiet,soft,modern').split(',')
const widths = (args.widths || '320,390,768,1024,1280,1440').split(',').map(Number)

// Runs inside the page. Elements inside [aria-hidden=true] are decorative art (LCD ghost digits,
// the jewel case) and are skipped for text checks; [data-audit-ignore] opts a subtree out explicitly.
const PAGE_CHECK = `(() => {
  const W = innerWidth, mobile = W <= 760, issues = [];
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.05; };
  const hidden = (el) => !!el.closest('[aria-hidden="true"],[data-audit-ignore],.sr-only,[hidden]');
  const label = (el) => el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0].replace(/_+[A-Za-z0-9-]+$/, '') : '');
  const floating = (el) => { for (let p = el; p && p !== document.body; p = p.parentElement) { const pos = getComputedStyle(p).position; if (pos === 'sticky' || pos === 'fixed') return true; } return false; };
  // intersect a text rect with every clipping ancestor (ellipsis, overflow:hidden), so clipped text doesn't count
  const clipTo = (r, el) => { let L = r.left, T = r.top, R = r.right, B = r.bottom;
    for (let p = el; p && p !== document.body; p = p.parentElement) { const cs = getComputedStyle(p); if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') { const q = p.getBoundingClientRect(); L = Math.max(L, q.left); T = Math.max(T, q.top); R = Math.min(R, q.right); B = Math.min(B, q.bottom); } }
    return { left: L, top: T, right: R, bottom: B, width: R - L, height: B - T }; };
  const inScroller = (el) => { for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === 'auto' || o === 'scroll' || o === 'hidden' || o === 'clip') return p; } return null; };

  // 1. horizontal page scroll
  const sw = document.documentElement.scrollWidth;
  if (sw > W + 1) {
    const wide = [...document.querySelectorAll('body *')].filter((el) => { const r = el.getBoundingClientRect(); return r.right > W + 1 && r.width > 0 && !inScroller(el); }).slice(0, 4).map(label);
    issues.push({ type: 'h-scroll', detail: 'scrollWidth ' + sw + ' > ' + W, where: wide.join(', ') });
  }

  // text boxes
  const boxes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent.trim()) continue;
    const el = n.parentElement;
    if (!el || hidden(el) || !visible(el)) continue;
    const cs = getComputedStyle(el);
    // 2. text below 11px
    const fs = parseFloat(cs.fontSize);
    if (fs < 10.95) issues.push({ type: 'tiny-text', detail: fs + 'px', where: label(el) + ' "' + n.textContent.trim().slice(0, 30) + '"' });
    const range = document.createRange(); range.selectNodeContents(n);
    // sticky/fixed layers (mobile dock, menus) float over scrolled content by design
    if (!floating(el)) for (const raw of range.getClientRects()) { const r = clipTo(raw, el); if (r.width > 1 && r.height > 1) boxes.push({ r, el }); }
  }
  // 3. overlapping text (different elements, neither containing the other)
  const seen = new Set();
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i], b = boxes[j];
    if (a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el)) continue;
    const x = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
    const y = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
    if (x > 2 && y > Math.min(a.r.height, b.r.height) * 0.35) {
      const key = label(a.el) + '|' + label(b.el);
      if (seen.has(key)) continue; seen.add(key);
      issues.push({ type: 'overlap', detail: Math.round(x) + '×' + Math.round(y) + 'px', where: label(a.el) + ' "' + a.el.textContent.trim().slice(0, 20) + '" ↔ ' + label(b.el) + ' "' + b.el.textContent.trim().slice(0, 20) + '"' });
    }
  }

  // 4. hit targets on mobile (inline links inside running text are exempt, as in WCAG 2.5.8)
  if (mobile) for (const el of document.querySelectorAll('a[href],button,input:not([type=hidden]),textarea,select,[role=button]')) {
    if (hidden(el) || !visible(el) || el.tabIndex < 0) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'inline' && el.closest('p,li') && el.closest('p,li').textContent.trim().length > el.textContent.trim().length + 20) continue;
    const r = el.getBoundingClientRect();
    if (r.height < 43.5 || r.width < 43.5) issues.push({ type: 'hit-target', detail: Math.round(r.width) + '×' + Math.round(r.height), where: label(el) + ' "' + (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 24) + '"' });
  }

  // 5. images: sizes + 6. native ratio (no cropping)
  for (const img of document.images) {
    if (!visible(img)) continue;
    const src = img.currentSrc || img.src;
    if (img.srcset && !img.sizes) issues.push({ type: 'no-sizes', detail: '', where: src.slice(-60) });
    if (!img.srcset && !/\\.svg/.test(src)) issues.push({ type: 'no-srcset', detail: '', where: src.slice(-60) });
    if (!img.complete || !img.naturalWidth) continue;
    const r = img.getBoundingClientRect(), fit = getComputedStyle(img).objectFit;
    const drift = Math.abs(r.width / r.height - img.naturalWidth / img.naturalHeight) / (img.naturalWidth / img.naturalHeight);
    const allowedCrop = !!img.closest('[data-allow-crop],[aria-hidden="true"]');
    if (drift > 0.015 && fit !== 'contain' && !allowedCrop) issues.push({ type: 'crop', detail: (drift * 100).toFixed(1) + '% (' + fit + ')', where: src.slice(-60) });
  }
  return issues;
})()`

const cdp = await launch()
const report = []
try {
  for (const route of routes) {
    const def = ROUTES[route]
    for (const skin of skins) {
      for (const width of widths) {
        for (const pass of ['fresh', 'cached']) {
          if (pass === 'fresh') await cdp.send('Network.clearBrowserCache')
          await openWithSkin(cdp, { base, path: def.path, skin, width })
          await sleep(300)
          const issues = await evaluate(cdp, PAGE_CHECK)
          for (const i of issues) report.push({ route, skin, width, pass, ...i })
        }
        process.stdout.write('.')
      }
    }
  }
} finally {
  await cdp.close()
}

// collapse duplicates (same issue on fresh + cached)
const uniq = new Map()
for (const r of report) {
  const key = [r.route, r.skin, r.width, r.type, r.where].join('|')
  if (!uniq.has(key)) uniq.set(key, { ...r, passes: [r.pass] })
  else uniq.get(key).passes.push(r.pass)
}
const rows = [...uniq.values()]
console.log(`\n${rows.length} issue(s)`)
for (const r of rows) console.log(`${r.route.padEnd(11)} ${r.skin.padEnd(6)} ${String(r.width).padEnd(5)} ${r.type.padEnd(10)} ${r.detail.padEnd(14)} ${r.where}  [${r.passes.join('+')}]`)
if (args.json) writeFileSync(args.json, JSON.stringify(rows, null, 2))
process.exitCode = rows.length ? 1 : 0
