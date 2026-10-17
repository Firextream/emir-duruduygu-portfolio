'use client'

// Photographs / Moodboard tabs shared by every skin's gallery. Both panels are server-rendered;
// this only switches which one is shown. "#moodboard" deep-links to the moodboard (the old
// /moodboard route redirects there).
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

export type GalleryTab = 'photos' | 'mood'

const Ctx = createContext<{ tab: GalleryTab; select: (t: GalleryTab) => void } | null>(null)

const useTabs = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('GalleryTabs components must be inside <GalleryTabs>')
  return ctx
}

export default function GalleryTabs({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<GalleryTab>('photos')

  useEffect(() => {
    const sync = () => setTab(window.location.hash === '#moodboard' ? 'mood' : 'photos')
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const select = useCallback((next: GalleryTab) => {
    setTab(next)
    const url = next === 'mood' ? '#moodboard' : window.location.pathname + window.location.search
    window.history.replaceState(window.history.state, '', url)
  }, [])

  return <Ctx.Provider value={{ tab, select }}>{children}</Ctx.Provider>
}

export function TabButton({ tab, className, children }: { tab: GalleryTab; className?: string; children: ReactNode }) {
  const { tab: current, select } = useTabs()
  return (
    <button
      type="button"
      role="tab"
      id={`tab-${tab}`}
      aria-selected={current === tab}
      aria-controls={`panel-${tab}`}
      className={className}
      onClick={() => select(tab)}
    >
      {children}
    </button>
  )
}

export function TabPanel({ tab, className, children }: { tab: GalleryTab; className?: string; children: ReactNode }) {
  const { tab: current } = useTabs()
  return (
    <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} hidden={current !== tab} className={className}>
      {children}
    </div>
  )
}

/** Renders its children only while the given tab is active (labels, counters, window titles). */
export function WhenTab({ tab, children }: { tab: GalleryTab; children: ReactNode }) {
  const { tab: current } = useTabs()
  return current === tab ? <>{children}</> : null
}
