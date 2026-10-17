import QGallery from '@/components/skins/quiet/QGallery'
import { galleryMetadata, getGalleryData } from '@/lib/routes/gallery'

export const revalidate = 300
export const metadata = galleryMetadata

export default async function Gallery() {
  return <QGallery {...await getGalleryData()} />
}
