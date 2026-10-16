// Any path the skin tree doesn't know renders this skin's 404 inside its frame.
import { notFound } from 'next/navigation'

export default function UnknownPage() {
  notFound()
}
