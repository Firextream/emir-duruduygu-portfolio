'use client'

import type { ReactNode } from 'react'

export default function BackToTop({ className, children }: { className?: string; children: ReactNode }) {
  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    document.getElementById('top')?.focus({ preventScroll: true })
  }
  return (
    <button type="button" className={className} onClick={toTop}>
      {children}
    </button>
  )
}
