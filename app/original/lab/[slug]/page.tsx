import OrigProject from '@/components/skins/original/OrigProject'
import { getProjectData, projectMetadata, projectStaticParams } from '@/lib/routes/lab'

export const revalidate = 300
export const generateStaticParams = projectStaticParams

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  return projectMetadata((await params).slug)
}

export default async function Project({ params }: Props) {
  return <OrigProject {...await getProjectData((await params).slug)} />
}
