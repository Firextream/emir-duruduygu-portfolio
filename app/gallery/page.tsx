import { getGalleryImages } from "@/lib/notion"
import GalleryClient from "./GalleryClient"

export default async function GalleryPage() {
  const images = await getGalleryImages()
  return <GalleryClient images={images} />
}
