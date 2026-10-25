import SPhoto from '@/components/skins/soft/SPhoto'
import { getPhotoData, photoMetadata, photoStaticParams } from '@/lib/routes/gallery'

export const generateStaticParams = photoStaticParams

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  return photoMetadata((await params).id)
}

export default async function Photo({ params }: Props) {
  return <SPhoto {...await getPhotoData((await params).id)} />
}
