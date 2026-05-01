import { unstable_cache } from "next/cache"
import { type MoodboardCollection } from "@/app/moodboard/data"

function normalizeEnvValue(value: string | undefined): string {
  return String(value || "")
    .trim()
    .replace(/^['"]+|['"]+$/g, "")
}

const directusUrlRaw = normalizeEnvValue(process.env.DIRECTUS_URL)
const directusUrl = directusUrlRaw.replace(/\/$/, "")
const directusToken = normalizeEnvValue(
  process.env.DIRECTUS_STATIC_TOKEN || process.env.DIRECTUS_TOKEN
)
// Default collection name for moodboards in Directus
const directusMoodboardCollection = "moodboards"

const isDirectusConfigured = Boolean(directusUrl)

export function isMoodboardDirectusConfigured() {
  return isDirectusConfigured
}

function getDirectusAssetUrl(fileValue: any) {
  if (!fileValue) return "/placeholder.svg"
  if (typeof fileValue === "string") {
    if (/^https?:\/\//i.test(fileValue)) return fileValue
    return `${directusUrl}/assets/${fileValue}`
  }
  if (typeof fileValue === "object") {
    const candidate = fileValue.id || fileValue.directus_files_id || fileValue.file
    if (typeof candidate === "string") {
      if (/^https?:\/\//i.test(candidate)) return candidate
      return `${directusUrl}/assets/${candidate}`
    }
  }
  return "/placeholder.svg"
}

async function _getMoodboardCollectionsFromDirectus(): Promise<MoodboardCollection[] | null> {
  if (!isDirectusConfigured) return null

  try {
    const url = new URL(`${directusUrl}/items/${directusMoodboardCollection}`)
    url.searchParams.set("fields", "*.*")
    // Optional: Only fetch published ones if there's a status field
    // url.searchParams.set("filter", JSON.stringify({ status: { _eq: "published" } }))
    
    const headers: Record<string, string> = {}
    if (directusToken) {
      headers.Authorization = `Bearer ${directusToken}`
    }

    const response = await fetch(url.toString(), {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      console.warn(`[Moodboard] Directus request failed (${response.status})`)
      return null
    }

    const payload = await response.json()
    if (!payload?.data || !Array.isArray(payload.data)) return null

    return payload.data.map((item: any) => {
      // Safely parse items JSON if it's stored as a string
      let items = []
      if (typeof item.items === 'string') {
        try {
          items = JSON.parse(item.items)
        } catch (e) {
          console.error(`[Moodboard] Failed to parse items JSON for ${item.id}`)
        }
      } else if (Array.isArray(item.items)) {
        items = item.items
      }

      // Generate a URL-friendly ID if not explicitly provided
      const id = item.slug || String(item.title || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")

      return {
        id: id || String(item.id),
        title: item.title || "Untitled",
        subtitle: item.subtitle || "",
        coverImage: getDirectusAssetUrl(item.cover_image || item.image || item.cover),
        items: items
      }
    })
  } catch (error) {
    console.error("[Moodboard] Error fetching from Directus:", error)
    return null
  }
}

// Export cached version
export const getMoodboardCollectionsFromDirectus = unstable_cache(
  _getMoodboardCollectionsFromDirectus,
  ['moodboard-collections'],
  { revalidate: 3600, tags: ['moodboard'] }
)
