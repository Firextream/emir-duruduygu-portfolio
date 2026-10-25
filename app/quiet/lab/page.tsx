import QLab from '@/components/skins/quiet/QLab'
import { getLabData, labMetadata } from '@/lib/routes/lab'

export const metadata = labMetadata

export default async function Lab() {
  return <QLab {...await getLabData()} />
}
