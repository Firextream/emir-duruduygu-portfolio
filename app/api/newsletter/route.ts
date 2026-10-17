// Newsletter endpoint — a stub for now: validate, log a redacted line, return ok.
// No third-party service yet (the previous Resend audience version is in git history).
import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

const Signup = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  website: z.string().max(0).optional(),
})

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }
  const parsed = Signup.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Please give a valid email address.' }, { status: 400 })
  }
  console.info(`[newsletter] signup from …@${parsed.data.email.split('@')[1]}`)
  return NextResponse.json({ ok: true })
}
