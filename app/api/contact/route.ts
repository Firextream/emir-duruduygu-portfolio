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

    // Send email via Resend
    if (!process.env.RESEND_API_KEY) {
      console.log("📧 Contact form submission (demo mode):", { name, email, message })
      return NextResponse.json({
        success: true,
        message: "Message received! (Demo mode - configure Resend for production)",
      })
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Contact Form <onboarding@resend.dev>",
        to: "edmesaj@outlook.com",
        subject: `New message from ${name}`,
        reply_to: email,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            Sent from your portfolio website contact form
          </p>
        `,
        text: `
New Contact Form Submission

Name: ${name}
Email: ${email}

Message:
${message}

---
Sent from your portfolio website contact form
        `,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Resend error:", error)
      throw new Error("Failed to send email")
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
