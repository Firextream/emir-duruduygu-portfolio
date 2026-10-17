// Contact form endpoint — a stub for now: validate, log a redacted line, return ok.
// No third-party service yet (the previous Resend version is in git history).
import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

const Contact = z.object({
  name: z.string().trim().max(120).optional().default(''),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(1).max(5000),
  /** honeypot — real people leave it empty */
  website: z.string().max(0).optional(),
})

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }
  const parsed = Contact.safeParse(body)
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path[0]
    const error = field === 'email' ? 'Please give a valid email address.' : field === 'message' ? 'Please write a message.' : 'Invalid request.'
    return NextResponse.json({ ok: false, error }, { status: 400 })
  }
  const { email, message, name } = parsed.data
  console.info(`[contact] message from …@${email.split('@')[1]} (${message.length} chars${name ? ', named' : ''})`)
  return NextResponse.json({ ok: true })
}
