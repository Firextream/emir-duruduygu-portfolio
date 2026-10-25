// Shared by /api/contact and /api/newsletter: client IP, a small rate limit and the Resend calls.
// Resend is reached over its REST API (no SDK). Without RESEND_API_KEY the routes answer 503 with a
// clear message — a form must never pretend a message went somewhere.
import 'server-only'
import { createHash } from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'
import { SITE_EMAIL } from './content/links'

const RESEND = 'https://api.resend.com'

export const json = (body: { ok: boolean; error?: string }, status = 200, headers?: HeadersInit) =>
  NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } })

/** The visitor's IP as the platform reports it (Cloudflare Tunnel, Vercel, then any proxy). */
export function clientIp(request: NextRequest): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  )
}

// ── rate limit ────────────────────────────────────────────────────────────────
// In memory, per server instance: enough against a script hammering one form. On Vercel each
// function instance keeps its own count, so the effective limit can be a little higher.
const hits = new Map<string, number[]>()

/** null when allowed; otherwise the seconds to wait. */
export function rateLimited(bucket: string, ip: string, limit: number, windowMs: number): number | null {
  const now = Date.now()
  const key = `${bucket}:${ip}`
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  if (recent.length >= limit) {
    hits.set(key, recent)
    return Math.ceil((windowMs - (now - recent[0])) / 1000)
  }
  recent.push(now)
  hits.set(key, recent)
  if (hits.size > 5000) for (const [k, list] of hits) if (list.every((t) => now - t >= windowMs)) hits.delete(k)
  return null
}

export const tooMany = (seconds: number) =>
  json({ ok: false, error: 'Too many tries — please wait a few minutes and try again.' }, 429, { 'Retry-After': String(seconds) })

// ── Resend ────────────────────────────────────────────────────────────────────

export const resendKey = () => process.env.RESEND_API_KEY?.trim() || ''

/** 503 for a form whose service isn't set up — the visitor is told, never shown a fake success. */
export const notConfigured = (error: string) => json({ ok: false, error }, 503)

async function resend(path: string, body: unknown, idempotencyKey?: string) {
  const res = await fetch(`${RESEND}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey()}`,
      'Content-Type': 'application/json',
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  })
  const payload = (await res.json().catch(() => ({}))) as { message?: string; name?: string }
  return { ok: res.ok, status: res.status, message: `${payload.name ?? ''} ${payload.message ?? ''}`.trim() }
}

/** The contact form → one plain-text email to CONTACT_TO, reply-to the visitor. */
export function sendContactEmail(m: { name: string; email: string; message: string }) {
  const from = process.env.RESEND_FROM?.trim() || `duruduygu.com <${SITE_EMAIL}>`
  const to = process.env.CONTACT_TO?.trim() || SITE_EMAIL
  const who = m.name ? `${m.name} <${m.email}>` : m.email
  // the same message sent twice (double click, retry) within 24 h is delivered once
  const key = 'contact-' + createHash('sha256').update(`${m.email}\n${m.message}`).digest('hex').slice(0, 40)
  return resend(
    '/emails',
    {
      from,
      to: [to],
      reply_to: m.email,
      subject: `duruduygu.com — message from ${m.name || m.email}`,
      // plain text only: nothing the visitor typed is ever rendered as HTML
      text: `${m.message}\n\n— ${who}\nSent from the contact form on duruduygu.com. Reply to answer.`,
    },
    key,
  )
}

/**
 * The newsletter form → a Resend contact, added to the newsletter segment when one is set
 * (RESEND_SEGMENT_ID; RESEND_AUDIENCE_ID, its name before Resend renamed audiences, works too).
 */
export function addNewsletterContact(email: string) {
  const segment = process.env.RESEND_SEGMENT_ID?.trim() || process.env.RESEND_AUDIENCE_ID?.trim()
  return resend('/contacts', { email, unsubscribed: false, ...(segment ? { segments: [{ id: segment }] } : {}) })
}

/** Resend's way of saying the contact is already there — for the visitor that's a success. */
export const alreadyExists = (r: { status: number; message: string }) => r.status === 409 || /already exists/i.test(r.message)
