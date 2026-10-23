import OrigPhoto from '@/components/skins/original/OrigPhoto'
import { getPhotoData, photoMetadata, photoStaticParams } from '@/lib/routes/gallery'

export const revalidate = 300
export const generateStaticParams = photoStaticParams

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  return photoMetadata((await params).id)
}

export default async function Photo({ params }: Props) {
  return <OrigPhoto {...await getPhotoData((await params).id)} />
}
