import QHome from '@/components/skins/quiet/QHome'
import { getHomeData } from '@/lib/routes/home'

export const revalidate = 300

export default async function Home() {
  return <QHome {...await getHomeData('quiet')} />
}
