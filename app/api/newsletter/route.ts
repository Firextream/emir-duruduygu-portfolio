// Newsletter form → a Resend contact in the newsletter segment (lib/forms). Honeypot and a per-IP
// rate limit; without RESEND_API_KEY a 503 that says so. An address that's already subscribed is
// answered like a new one, so the form can't be used to look up who subscribed.
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { addNewsletterContact, alreadyExists, clientIp, json, notConfigured, rateLimited, resendKey, tooMany } from '@/lib/forms'

const Signup = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  /** honeypot — real people leave it empty */
  website: z.string().optional(),
})

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, 400)
  }
  const parsed = Signup.safeParse(body)
  if (!parsed.success) return json({ ok: false, error: 'Please give a valid email address.' }, 400)
  if (parsed.data.website) return json({ ok: true })

  const wait = rateLimited('newsletter', clientIp(request), 5, 10 * 60 * 1000)
  if (wait) return tooMany(wait)
  if (!resendKey()) return notConfigured('The newsletter isn’t switched on yet — please try again soon.')

  const { email } = parsed.data
  const added = await addNewsletterContact(email)
  if (!added.ok && !alreadyExists(added)) {
    console.error(`[newsletter] Resend refused the signup: HTTP ${added.status} ${added.message}`)
    return json({ ok: false, error: 'That didn’t work just now. Please try again in a minute.' }, 502)
  }
  console.info(`[newsletter] signup from …@${email.split('@')[1]}${added.ok ? '' : ' (already subscribed)'}`)
  return json({ ok: true })
}
