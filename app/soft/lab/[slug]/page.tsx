import SProject from '@/components/skins/soft/SProject'
import { getProjectData, projectMetadata, projectStaticParams } from '@/lib/routes/lab'

export const revalidate = 300
export const generateStaticParams = projectStaticParams

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  return projectMetadata((await params).slug)
}

export default async function Project({ params }: Props) {
  return <SProject {...await getProjectData((await params).slug)} />
}
