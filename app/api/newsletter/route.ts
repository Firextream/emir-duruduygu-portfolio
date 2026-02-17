import { NextRequest, NextResponse } from "next/server"

function normalizeEmail(value: unknown) {
  return String(value || "").trim().toLowerCase()
}

function hasNewsletterConfig() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = normalizeEmail(body?.email)

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      )
    }

    if (!hasNewsletterConfig()) {
      return NextResponse.json(
        {
          error: "Newsletter not configured. Please set RESEND_API_KEY and RESEND_AUDIENCE_ID.",
        },
        { status: 503 }
      )
    }

    const response = await fetch(`https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        unsubscribed: false,
      }),
    })

    if (!response.ok) {
      let payload: { message?: string } = {}
      try {
        payload = await response.json()
      } catch {
        // Ignore JSON parsing errors from provider.
      }

      const message = String(payload?.message || "").toLowerCase()
      const alreadySubscribed =
        response.status === 409 ||
        message.includes("already exists") ||
        message.includes("already subscribed")

      if (alreadySubscribed) {
        return NextResponse.json(
          { error: "This email is already subscribed." },
          { status: 409 }
        )
      }

      console.error("Resend newsletter error:", payload)
      return NextResponse.json(
        { error: "Unable to subscribe right now. Please try again shortly." },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Thanks for subscribing! You will receive new updates.",
    })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    )
  }
}

// Operational status endpoint (safe to expose).
export async function GET() {
  return NextResponse.json({
    provider: "resend",
    configured: hasNewsletterConfig(),
    whereToCheck: "Resend Dashboard -> Audiences -> Contacts",
  })
}
