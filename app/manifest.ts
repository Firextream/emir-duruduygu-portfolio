import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Emir Duruduygu - Photography & Creative Portfolio",
    short_name: "ED Portfolio",
    description: "Amateur photographer and curious explorer. Architecture, street photography, and everything that catches my eye.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#3d5a4c",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    categories: ["photography", "portfolio", "personal"],
    screenshots: [
      {
        src: "/screenshot-wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide"
      },
      {
        src: "/screenshot-narrow.png",
        sizes: "640x1136",
        type: "image/png",
        form_factor: "narrow"
      }
    ],
    shortcuts: [
      {
        name: "Gallery",
        url: "/gallery",
        description: "View photography collection"
      },
      {
        name: "Blog",
        url: "/blog",
        description: "Read latest posts"
      },
      {
        name: "Portfolio",
        url: "/portfolio",
        description: "View projects"
      }
    ]
  }
}
