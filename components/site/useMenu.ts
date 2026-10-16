'use client'

// Open/close state for a popup menu: Escape and outside clicks close it, focus returns to the trigger.
import { useCallback, useEffect, useRef, useState } from 'react'

export function useMenu<T extends HTMLElement = HTMLDivElement>() {
  const [open, setOpen] = useState(false)
  const panel = useRef<T>(null)
  const trigger = useRef<HTMLButtonElement>(null)

  const close = useCallback((refocus = true) => {
    setOpen(false)
    if (refocus) trigger.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (!panel.current?.contains(t) && !trigger.current?.contains(t)) close(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open, close])

  const toggle = useCallback(() => setOpen((o) => !o), [])
  return { open, setOpen, toggle, close, panel, trigger }
}
