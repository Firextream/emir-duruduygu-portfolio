'use client'

// Holds the visitor's style {skin, acc}. localStorage 'duru-style-v2' is the source of truth;
// the 'duru-skin' cookie mirrors the skin for the server. Switching skin shows the target skin's
// curtain for 900 ms, then reloads into the new skin tree (whose curtain fades out over 400 ms).
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ACCENT_COUNT, SKIN_COOKIE, SKIN_INFO, STORAGE_KEY, SWITCH_FLAG, type Skin } from '@/lib/skins'
import SkinCurtain from './SkinCurtain'

interface StyleContext {
  skin: Skin
  acc: number
  setAcc: (acc: number) => void
  switchSkin: (skin: Skin) => void
  switching: Skin | null
}

const Ctx = createContext<StyleContext | null>(null)

export function useStyle(): StyleContext {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStyle must be used inside <StyleProvider>')
  return ctx
}

const save = (value: { skin: Skin; acc: number }) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // storage blocked — the cookie still carries the skin
  }
}

export const SWITCH_MS = 900

export default function StyleProvider({ skin, children }: { skin: Skin; children: ReactNode }) {
  const [acc, setAccState] = useState(0)
  const [switching, setSwitching] = useState<Skin | null>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    // The pre-paint script already normalised storage and set data-acc; mirror it into React state.
    const attr = Number(document.documentElement.getAttribute('data-acc') || 0)
    setAccState(Math.min(ACCENT_COUNT[skin] - 1, Math.max(0, attr)))
    return () => window.clearTimeout(timer.current)
  }, [skin])

  const setAcc = useCallback(
    (next: number) => {
      const value = Math.min(ACCENT_COUNT[skin] - 1, Math.max(0, next))
      setAccState(value)
      document.documentElement.setAttribute('data-acc', String(value))
      save({ skin, acc: value })
    },
    [skin],
  )

  const switchSkin = useCallback(
    (next: Skin) => {
      if (next === skin || switching) return
      setSwitching(next)
      timer.current = window.setTimeout(() => {
        save({ skin: next, acc: 0 })
        document.cookie = `${SKIN_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`
        try {
          sessionStorage.setItem(SWITCH_FLAG, next)
        } catch {
          // no curtain on arrival, the switch still works
        }
        window.scrollTo(0, 0)
        window.location.reload()
      }, SWITCH_MS)
    },
    [skin, switching],
  )

  const value = useMemo(() => ({ skin, acc, setAcc, switchSkin, switching }), [skin, acc, setAcc, switchSkin, switching])

  return (
    <Ctx.Provider value={value}>
      {children}
      {switching && <SkinCurtain skin={switching} variant="leave" />}
      <div role="status" aria-live="polite" className="sr-only">
        {switching ? `Switching to ${SKIN_INFO[switching].label}…` : ''}
      </div>
    </Ctx.Provider>
  )
}
