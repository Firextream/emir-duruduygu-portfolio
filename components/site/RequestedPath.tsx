'use client'

// The path that wasn't found, for a 404 page (the browser URL, before the skin rewrite).
import { usePathname } from 'next/navigation'

export default function RequestedPath({ className }: { className?: string }) {
  const path = usePathname()
  return <span className={className}>{path && path !== '/' ? path : '[requested path]'}</span>
}
