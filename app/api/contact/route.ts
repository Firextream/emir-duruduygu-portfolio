import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    // Validate fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Please fill in all fields" },
        { status: 400 }
      )
    }

    // Validate email format
    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      )
    }

    // Send to Formspree (more reliable for contact forms)
    const response = await fetch("https://formspree.io/f/maqyjnqd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to send message")
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
    })

  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again or email directly." },
      { status: 500 }
    )
  }
}
