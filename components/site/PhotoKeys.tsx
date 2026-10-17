'use client'

// Photo viewer keyboard: ← / → browse, Esc back to the gallery (README, Soft Club "Photo").
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function PhotoKeys({ prev, next }: { prev: string; next: string }) {
  const router = useRouter()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
      const t = e.target as HTMLElement | null
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
      if (document.getElementById('style-menu')) return
      if (e.key === 'ArrowRight') router.push(next)
      else if (e.key === 'ArrowLeft') router.push(prev)
      else if (e.key === 'Escape') router.push('/gallery')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router, prev, next])
  return null
}
