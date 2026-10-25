import QProject from '@/components/skins/quiet/QProject'
import { getProjectData, projectMetadata, projectStaticParams } from '@/lib/routes/lab'

export const generateStaticParams = projectStaticParams

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  return projectMetadata((await params).slug)
}

export default async function Project({ params }: Props) {
  return <QProject {...await getProjectData((await params).slug)} />
}
