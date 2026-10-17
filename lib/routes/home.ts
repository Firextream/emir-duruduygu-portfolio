// Data for the Home page in every skin.
import { getHomePhoto, getMood, getPhotos, getPosts, getProjects } from '@/lib/content'
import type { Skin } from '@/lib/skins'

export async function getHomeData(skin: Skin) {
  const [hero, photos, posts, projects, mood] = await Promise.all([
    getHomePhoto(skin),
    getPhotos(),
    getPosts(),
    getProjects(),
    getMood(),
  ])
  const heroIndex = hero ? photos.findIndex((p) => p.id === hero.id) : -1
  // "A few recent frames": the photos after the hero, in gallery order
  const others = photos.filter((p) => p.id !== hero?.id)
  return { hero, heroIndex, photos, others, posts, projects, moodCount: mood.length }
}

export type HomeData = Awaited<ReturnType<typeof getHomeData>>

/** "[001]" — a photo's catalogue number is its position in the gallery. */
export const catalogueNo = (index: number) => `[${String(index + 1).padStart(3, '0')}]`
