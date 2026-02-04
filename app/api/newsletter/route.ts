import { NextRequest, NextResponse } from "next/server"

// Newsletter subscribers stored in memory (for demo)
// In production, use a database like Supabase, Prisma, etc.
const subscribers = new Set<string>()

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      )
    }

    // Check if already subscribed (in-memory check)
    if (subscribers.has(email.toLowerCase())) {
      return NextResponse.json(
        { error: "This email is already subscribed" },
        { status: 400 }
      )
    }

    // Option 1: Resend integration (recommended)
    if (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) {
      const response = await fetch("https://api.resend.com/audiences/" + process.env.RESEND_AUDIENCE_ID + "/contacts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          unsubscribed: false,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("Resend error:", error)
        
        // Check if already exists
        if (error.message?.includes("already exists")) {
          return NextResponse.json(
            { error: "This email is already subscribed" },
            { status: 400 }
          )
        }
        
        throw new Error("Failed to subscribe")
      }

      return NextResponse.json({
        success: true,
        message: "Thanks for subscribing! You'll receive updates soon.",
      })
    }

    // Option 2: Buttondown integration
    if (process.env.BUTTONDOWN_API_KEY) {
      const response = await fetch("https://api.buttondown.email/v1/subscribers", {
        method: "POST",
        headers: {
          "Authorization": `Token ${process.env.BUTTONDOWN_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("Buttondown error:", error)
        throw new Error("Failed to subscribe")
      }

      return NextResponse.json({
        success: true,
        message: "Thanks for subscribing! Check your email to confirm.",
      })
    }

    // Fallback: Store in memory (demo mode)
    subscribers.add(email.toLowerCase())
    console.log("📧 New subscriber (demo mode):", email)
    console.log("📧 Total subscribers:", subscribers.size)

    return NextResponse.json({
      success: true,
      message: "Thanks for subscribing! (Demo mode - configure Resend or Buttondown for production)",
    })

  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    )
  }
}

// GET endpoint to check subscriber count (optional, for admin)
export async function GET() {
  return NextResponse.json({
    count: subscribers.size,
    message: "Demo mode - subscribers stored in memory",
  })
}
