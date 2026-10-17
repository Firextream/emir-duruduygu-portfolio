import SHome from '@/components/skins/soft/SHome'
import { getHomeData } from '@/lib/routes/home'

export const revalidate = 300

export default async function Home() {
  const { hero, photos, posts, projects } = await getHomeData('soft')
  // only what the client component needs (no post bodies in the payload)
  const lightPosts = posts.slice(0, 4).map((p) => ({ ...p, body: [], cover: null, video: null }))
  return <SHome heroId={hero?.id ?? null} photos={photos} posts={lightPosts} projects={projects} />
}
