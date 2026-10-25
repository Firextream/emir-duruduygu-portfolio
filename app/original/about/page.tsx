import OrigAbout from '@/components/skins/original/OrigAbout'
import { aboutMetadata, getAboutData } from '@/lib/routes/about'

export const metadata = aboutMetadata

export default async function About() {
  return <OrigAbout {...await getAboutData()} />
}
