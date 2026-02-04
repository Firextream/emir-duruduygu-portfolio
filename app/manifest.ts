import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Duruduygu - Photography & Creative Portfolio",
    short_name: "Duruduygu",
    description: "Amateur photographer and curious explorer. Architecture, street photography, and everything that catches my eye.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#3d5a4c",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192.jpg",
        sizes: "192x192",
        type: "image/jpeg",
        purpose: "any maskable"
      },
      {
        src: "/icon-512.jpg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "any maskable"
      }
    ],
    categories: ["photography", "portfolio", "personal"],
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
