import OrigLab from '@/components/skins/original/OrigLab'
import { getLabData, labMetadata } from '@/lib/routes/lab'

export const revalidate = 300
export const metadata = labMetadata

export default async function Lab() {
  return <OrigLab {...await getLabData()} />
}
