import QAbout from '@/components/skins/quiet/QAbout'
import { aboutMetadata, getAboutData } from '@/lib/routes/about'

export const revalidate = 300
export const metadata = aboutMetadata

export default async function About() {
  return <QAbout {...await getAboutData()} />
}
