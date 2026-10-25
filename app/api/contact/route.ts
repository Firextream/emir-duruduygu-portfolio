// Contact form → Resend (lib/forms). Honeypot and a per-IP rate limit; without RESEND_API_KEY a 503
// that says so. The visitor's text only ever goes out as plain text.
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { SITE_EMAIL } from '@/lib/content/links'
import { clientIp, json, notConfigured, rateLimited, resendKey, sendContactEmail, tooMany } from '@/lib/forms'

const Contact = z.object({
  name: z.string().trim().max(120).optional().default(''),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(1).max(5000),
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
  const parsed = Contact.safeParse(body)
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path[0]
    const error = field === 'email' ? 'Please give a valid email address.' : field === 'message' ? 'Please write a message.' : 'Invalid request.'
    return json({ ok: false, error }, 400)
  }
  // a bot filled the hidden field: look successful, send nothing
  if (parsed.data.website) return json({ ok: true })

  const wait = rateLimited('contact', clientIp(request), 5, 10 * 60 * 1000)
  if (wait) return tooMany(wait)
  if (!resendKey()) return notConfigured(`The contact form isn’t switched on yet. Please write to ${SITE_EMAIL} instead.`)

  const { name, email, message } = parsed.data
  const sent = await sendContactEmail({ name, email, message })
  if (!sent.ok) {
    console.error(`[contact] Resend refused the message: HTTP ${sent.status} ${sent.message}`)
    return json({ ok: false, error: 'The message couldn’t be sent just now. Please try again, or email me directly.' }, 502)
  }
  console.info(`[contact] sent a message from …@${email.split('@')[1]} (${message.length} chars)`)
  return json({ ok: true })
}
