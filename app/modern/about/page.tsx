import OAbout from '@/components/skins/modern/OAbout'
import { aboutMetadata, getAboutData } from '@/lib/routes/about'

export const metadata = aboutMetadata

export default async function About() {
  return <OAbout {...await getAboutData()} />
}
