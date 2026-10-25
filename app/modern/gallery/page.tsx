import OGallery from '@/components/skins/modern/OGallery'
import { galleryMetadata, getGalleryData } from '@/lib/routes/gallery'

export const metadata = galleryMetadata

export default async function Gallery() {
  return <OGallery {...await getGalleryData()} />
}
