import type React from "react"
import type { Metadata } from "next"
import { Work_Sans, Open_Sans } from "next/font/google"
import "./globals.css"

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
})

export const metadata: Metadata = {
  title: "Emir Duruduygu - Architectural Photography & Design Portfolio",
  description:
    "Award-winning architectural photographer and designer specializing in modernist aesthetics. Explore stunning photography, insightful blog posts, and professional work.",
  keywords: ["architectural photography", "modernist design", "portfolio", "photography", "architecture", "minimalist"],
  authors: [{ name: "Emir Duruduygu" }],
  creator: "Emir Duruduygu",
  publisher: "Emir Duruduygu Portfolio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://alexchen-portfolio.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Emir Duruduygu - Architectural Photography & Design",
    description: "Award-winning architectural photographer specializing in modernist aesthetics and minimalist design.",
    url: "https://alexchen-portfolio.vercel.app",
    siteName: "Emir Duruduygu Portfolio",
    images: [
      {
        url: "/modernist-architectural-building-with-clean-geomet.png",
        width: 1200,
        height: 630,
        alt: "Emir Duruduygu - Architectural Photography Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Emir Duruduygu - Architectural Photography",
    description: "Award-winning architectural photographer specializing in modernist aesthetics.",
    images: ["/modernist-architectural-building-with-clean-geomet.png"],
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
    <html lang="en" className={`${workSans.variable} ${openSans.variable} antialiased`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="font-body architectural-rectangular">{children}</body>
    </html>
  )
}
