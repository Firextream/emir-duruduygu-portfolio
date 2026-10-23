import SPost from '@/components/skins/soft/SPost'
import { getPostData, postMetadata, postStaticParams } from '@/lib/routes/journal'

export const revalidate = 300
export const generateStaticParams = postStaticParams

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  return postMetadata((await params).slug)
}

export default async function Post({ params }: Props) {
  return <SPost {...await getPostData((await params).slug)} />
}
