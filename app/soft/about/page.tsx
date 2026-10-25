import SAbout from '@/components/skins/soft/SAbout'
import { aboutMetadata, getAboutData } from '@/lib/routes/about'

export const metadata = aboutMetadata

export default async function About() {
  return <SAbout {...await getAboutData()} />
}
