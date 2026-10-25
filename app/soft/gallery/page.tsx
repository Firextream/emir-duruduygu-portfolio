import SGallery from '@/components/skins/soft/SGallery'
import { galleryMetadata, getGalleryData } from '@/lib/routes/gallery'

export const metadata = galleryMetadata

export default async function Gallery() {
  return <SGallery {...await getGalleryData()} />
}
