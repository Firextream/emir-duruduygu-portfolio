import OrigGallery from '@/components/skins/original/OrigGallery'
import { galleryMetadata, getGalleryData } from '@/lib/routes/gallery'

export const metadata = galleryMetadata

export default async function Gallery() {
  return <OrigGallery {...await getGalleryData()} />
}
