import OPost from '@/components/skins/modern/OPost'
import { getPostData, postMetadata, postStaticParams } from '@/lib/routes/journal'

export const generateStaticParams = postStaticParams

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  return postMetadata((await params).slug)
}

export default async function Post({ params }: Props) {
  return <OPost {...await getPostData((await params).slug)} />
}
