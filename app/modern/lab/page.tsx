import OLab from '@/components/skins/modern/OLab'
import { getLabData, labMetadata } from '@/lib/routes/lab'

export const metadata = labMetadata

export default async function Lab() {
  return <OLab {...await getLabData()} />
}
