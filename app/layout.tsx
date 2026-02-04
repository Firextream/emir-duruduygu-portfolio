import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { SocialButtons } from "@/components/social-buttons"
import { BackToTop } from "@/components/back-to-top"
import { ThemeProvider } from "@/components/theme-provider"
import { StructuredData } from "@/lib/structured-data"
import { SkipToContent } from "@/components/skip-to-content"
import { ServiceWorkerRegistration } from "@/components/service-worker-registration"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Duruduygu - Photography & Stories",
  description:
    "Amateur photographer and curious explorer. Capturing architecture, street moments, and anything that sparks inspiration—structure, light, and the unexpected.",
  keywords: ["photography", "gallery", "blog", "street photography", "architecture", "stories", "creative"],
  authors: [{ name: "Duruduygu" }],
  creator: "Duruduygu",
  publisher: "Duruduygu Portfolio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://emirduruduygu.vercel.app"),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    title: "Duruduygu - Photography & Stories",
    description: "Amateur photographer and curious explorer. Capturing architecture, street moments, and anything that sparks inspiration—structure, light, and the unexpected.",
    url: "https://emirduruduygu.vercel.app",
    siteName: "Duruduygu",
    images: [
      {
        url: "/coastal-harbor-scene.jpg",
        width: 1200,
        height: 630,
        alt: "Duruduygu - Coastal Harbor Scene",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Duruduygu - Photography & Stories",
    description: "Amateur photographer and curious explorer. Capturing architecture, street moments, and anything that sparks inspiration—structure, light, and the unexpected.",
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
  icons: {
    icon: [
      { url: "/icon-192.jpg", sizes: "192x192", type: "image/jpeg" },
      { url: "/icon-512.jpg", sizes: "512x512", type: "image/jpeg" },
    ],
    apple: [
      { url: "/icon-192.jpg", sizes: "192x192", type: "image/jpeg" },
    ],
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="view-transition" content="same-origin" />
        {/* Preload critical resources */}
        <link rel="preload" href="/coastal-harbor-scene.jpg" as="image" fetchPriority="high" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preconnect to Notion image hosts for faster LCP */}
        <link rel="preconnect" href="https://prod-files-secure.s3.us-west-2.amazonaws.com" />
        <link rel="preconnect" href="https://s3.us-west-2.amazonaws.com" />
        <link rel="dns-prefetch" href="https://prod-files-secure.s3.us-west-2.amazonaws.com" />
        <link rel="dns-prefetch" href="https://s3.us-west-2.amazonaws.com" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#fafafa" />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SkipToContent />
          <ServiceWorkerRegistration />
          <StructuredData type="website" data={{}} />
          <StructuredData type="person" data={{}} />
          <main id="main-content">
            {children}
          </main>
          <SocialButtons />
          <BackToTop />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
