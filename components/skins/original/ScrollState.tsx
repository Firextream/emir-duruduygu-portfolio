'use client'

// Mirrors the scroll position onto <html> for Original's CSS: data-scrolled (past 24px: the header
// turns solid and the pill flattens) and data-past (past 640px: the home rail fades in).
import { useEffect } from 'react'

export default function ScrollState() {
  useEffect(() => {
    const html = document.documentElement
    const onScroll = () => {
      html.toggleAttribute('data-scrolled', window.scrollY > 24)
      html.toggleAttribute('data-past', window.scrollY > 640)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      html.removeAttribute('data-scrolled')
      html.removeAttribute('data-past')
    }
  }, [])
  return null
}
