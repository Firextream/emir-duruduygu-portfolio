import SLab from '@/components/skins/soft/SLab'
import { getLabData, labMetadata } from '@/lib/routes/lab'

export const metadata = labMetadata

export default async function Lab() {
  const { projects } = await getLabData()
  return <SLab projects={projects} />
}
