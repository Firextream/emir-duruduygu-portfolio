// /keystatic in production: nobody gets the editor without signing in with GitHub first.
//   - no GitHub token cookie                    → sent to GitHub sign-in (/api/keystatic/github/login)
//   - KEYSTATIC_ALLOWED_GITHUB_USERS is set     → the token's GitHub account must be on that list (403
//                                                 otherwise); checked against api.github.com, cached 10 min
// Whoever signs in can only save to the repo if GitHub lets their account write to it — that's
// Keystatic's own protection; this gate keeps the editor itself out of sight. Local mode (dev)
// passes through. Every response says noindex.
import { NextResponse, type NextRequest } from 'next/server'
import { KEYSTATIC_ACCESS_COOKIE, KEYSTATIC_STORAGE } from './keystatic-mode'

const NOINDEX = 'noindex, nofollow'
const CACHE_MS = 10 * 60 * 1000
const logins = new Map<string, { login: string | null; until: number }>()

function allowedUsers(): Set<string> {
  return new Set(
    (process.env.KEYSTATIC_ALLOWED_GITHUB_USERS ?? '')
      .split(',')
      .map((u) => u.trim().toLowerCase())
      .filter(Boolean),
  )
}

/** The GitHub login behind a user token; null when GitHub says the token is no good. */
async function githubLogin(token: string): Promise<string | null> {
  const hit = logins.get(token)
  if (hit && hit.until > Date.now()) return hit.login
  const res = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'duruduygu-keystatic-gate' },
    cache: 'no-store',
  })
  if (res.status === 401) return null
  if (!res.ok) throw new Error(`GitHub /user → HTTP ${res.status}`)
  const login = ((await res.json()) as { login?: string }).login?.toLowerCase() ?? null
  if (logins.size > 100) logins.clear()
  logins.set(token, { login, until: Date.now() + CACHE_MS })
  return login
}

const noindex = (res: NextResponse) => {
  res.headers.set('X-Robots-Tag', NOINDEX)
  res.headers.set('Cache-Control', 'no-store')
  return res
}

const text = (body: string, status: number) =>
  noindex(new NextResponse(`${body}\n`, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }))

export async function keystaticGate(request: NextRequest): Promise<NextResponse> {
  if (KEYSTATIC_STORAGE === 'local') return noindex(NextResponse.next())

  const signIn = noindex(NextResponse.redirect(new URL('/api/keystatic/github/login', request.url)))
  const token = request.cookies.get(KEYSTATIC_ACCESS_COOKIE)?.value
  if (!token) return signIn

  const allowed = allowedUsers()
  if (!allowed.size) return noindex(NextResponse.next())
  try {
    const login = await githubLogin(token)
    if (login === null) return signIn
    if (!allowed.has(login)) return text(`The GitHub account “${login}” can’t edit this site.`, 403)
  } catch (error) {
    console.error('[keystatic] GitHub check failed:', error instanceof Error ? error.message : error)
    return text('Couldn’t check your GitHub account just now. Try again in a minute.', 503)
  }
  return noindex(NextResponse.next())
}
