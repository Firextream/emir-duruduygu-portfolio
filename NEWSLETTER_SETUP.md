# Newsletter Setup (Resend)

This project stores newsletter subscribers in Resend Audience contacts.

## How It Works

- API route: `app/api/newsletter/route.ts`
- Provider request: `POST /audiences/{RESEND_AUDIENCE_ID}/contacts`

## Required Environment Variables

- `RESEND_API_KEY`
- `RESEND_AUDIENCE_ID`
- `NEXT_PUBLIC_SITE_URL=https://www.duruduygu.com`

If `RESEND_API_KEY` or `RESEND_AUDIENCE_ID` is missing, `POST /api/newsletter` returns:

- `503`
- `{"error":"Newsletter not configured. Please set RESEND_API_KEY and RESEND_AUDIENCE_ID."}`

## Where Subscriber Emails Are Stored

In Resend dashboard:

1. Open `Audiences`
2. Select your audience
3. Open `Contacts`

`API Keys` page is only for key management, not subscriber data.
