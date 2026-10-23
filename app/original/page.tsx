import OrigHome from '@/components/skins/original/OrigHome'
import { getHomeData } from '@/lib/routes/home'

export const revalidate = 300

export default async function Home() {
  return <OrigHome {...await getHomeData('original')} />
}
