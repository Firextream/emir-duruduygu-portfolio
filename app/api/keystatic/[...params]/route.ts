// Keystatic's API: file reads/writes in local mode (dev), GitHub sign-in and tokens in GitHub mode.
// Until the GitHub App's variables exist (KEYSTATIC.md) it answers 503 — Keystatic itself would
// throw while the module loads and take the whole build down with it.
import { makeRouteHandler } from '@keystatic/next/route-handler'
import { KEYSTATIC_STORAGE } from '@/lib/keystatic-mode'
import config from '../../../../keystatic.config'

const ready =
  KEYSTATIC_STORAGE === 'local' ||
  Boolean(process.env.KEYSTATIC_GITHUB_CLIENT_ID && process.env.KEYSTATIC_GITHUB_CLIENT_SECRET && process.env.KEYSTATIC_SECRET)

const notSetUp = () =>
  new Response('Keystatic isn’t set up on this deployment yet: add the GitHub App variables (see KEYSTATIC.md).\n', {
    status: 503,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' },
  })

export const { GET, POST } = ready ? makeRouteHandler({ config }) : { GET: notSetUp, POST: notSetUp }
