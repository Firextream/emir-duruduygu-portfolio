// Serves each skin from its own route tree (app/quiet, app/soft, app/modern) behind clean URLs.
//   /gallery  →  rewrite to /<skin>/gallery, where <skin> comes from the 'duru-skin' cookie.
// A first visit (no cookie) gets a random skin, remembered for a year. localStorage stays the
// source of truth — the pre-paint script re-syncs this cookie if the two ever disagree.
// Runs on Vercel and in the standalone Docker server alike.
import { NextResponse, type NextRequest } from 'next/server'
import { isSkin, SKIN_COOKIE, SKINS } from '@/lib/skins'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const first = pathname.split('/')[1]

  // The skin trees are internal: /modern/blog → /blog
  if (isSkin(first)) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(first.length + 1) || '/'
    return NextResponse.redirect(url, 308)
  }

  const cookie = request.cookies.get(SKIN_COOKIE)?.value
  const skin = isSkin(cookie) ? cookie : SKINS[Math.floor(Math.random() * SKINS.length)]

  const url = request.nextUrl.clone()
  url.pathname = `/${skin}${pathname === '/' ? '' : pathname}`
  const response = NextResponse.rewrite(url)
  if (cookie !== skin) {
    response.cookies.set(SKIN_COOKIE, skin, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })
  }
  return response
}

export const config = {
  // Everything except API routes, Next internals, metadata routes and files with an extension
  // (public/*, feed.xml, sitemap.xml, robots.txt, manifest.webmanifest, icon.svg …).
  matcher: ['/((?!api/|_next/|opengraph-image|twitter-image|.*\\.[A-Za-z0-9]+$).*)'],
}
