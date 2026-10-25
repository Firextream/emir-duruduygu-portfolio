// Where Keystatic saves: the local files in development, GitHub (one commit per save) in production.
// Kept apart from keystatic.config.ts so the middleware can read it without loading Keystatic.
// NEXT_PUBLIC_KEYSTATIC_STORAGE=local forces local mode in a production build — for testing the
// editor on this machine only; Vercel's file system is read-only.

export const KEYSTATIC_STORAGE: 'local' | 'github' =
  process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE !== 'local' ? 'github' : 'local'

export const KEYSTATIC_REPO = (process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO || 'Firextream/emir-duruduygu-portfolio') as `${string}/${string}`

/** Keystatic's own cookies (set by /api/keystatic/github/oauth/callback). */
export const KEYSTATIC_ACCESS_COOKIE = 'keystatic-gh-access-token'
