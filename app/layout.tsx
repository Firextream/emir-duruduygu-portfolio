import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { SocialButtons } from "@/components/social-buttons"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400"],
})

export const metadata: Metadata = {
  title: "Emir Duruduygu - Photography & Creative Portfolio",
  description:
    "Amateur photographer and curious explorer. Architecture, street photography, and everything that catches my eye along the way.",
  keywords: ["photography", "architecture", "street photography", "portfolio", "creative", "exploration"],
  authors: [{ name: "Emir Duruduygu" }],
  creator: "Emir Duruduygu",
  publisher: "Emir Duruduygu Portfolio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://emirduruduygu.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Emir Duruduygu - Photography & Creative Portfolio",
    description: "Amateur photographer and curious explorer. Capturing moments, places, and things that catch my eye.",
    url: "https://emirduruduygu.vercel.app",
    siteName: "Emir Duruduygu Portfolio",
    images: [
      {
        url: "/coastal-harbor-scene.jpg",
        width: 1200,
        height: 630,
        alt: "Emir Duruduygu - Coastal Harbor Scene",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Emir Duruduygu - Photography & Creative Portfolio",
    description: "Amateur photographer and curious explorer. Capturing moments, places, and things that catch my eye.",
    images: ["/coastal-harbor-scene.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#fafafa" />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        {children}
        <SocialButtons />
        <SpeedInsights />
      </body>
    </html>
  )
}
