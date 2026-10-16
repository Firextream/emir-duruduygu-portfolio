import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Duruduygu",
    short_name: "Duruduygu",
    description: "Photographs of Istanbul, a journal, and a small lab for hardware and clothes.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f2f2",
    theme_color: "#f3f2f2",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192.jpg",
        sizes: "192x192",
        type: "image/jpeg",
        purpose: "any"
      },
      {
        src: "/icon-512.jpg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "any"
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
        name: "Journal",
        url: "/blog",
        description: "Read the journal"
      },
      {
        name: "Lab",
        url: "/lab",
        description: "Hardware and clothes in progress"
      }
    ]
  }
}
