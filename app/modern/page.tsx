import OHome from '@/components/skins/modern/OHome'
import { getHomeData } from '@/lib/routes/home'

export const revalidate = 300

export default async function Home() {
  return <OHome {...await getHomeData('modern')} />
}
