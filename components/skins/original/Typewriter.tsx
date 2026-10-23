'use client'

// The hero's typewriter line: types at 85ms a character, holds 2s, deletes at 40ms, then the next
// phrase. It starts on the full first phrase (what the server renders), so first paint and no-JS
// match; its height is reserved by an invisible copy of the longest phrase, so retyping never
// reflows the page. Reduced motion: the first phrase stays put.
import { useEffect, useState } from 'react'
import s from './OrigHome.module.css'

const TYPE_MS = 85
const DELETE_MS = 40
const HOLD_MS = 2000
const NEXT_MS = 400

export default function Typewriter({ phrases }: { phrases: readonly string[] }) {
  const [state, setState] = useState({ i: 0, n: phrases[0].length, del: false })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const { i, n, del } = state
    const word = phrases[i]
    let delay = del ? DELETE_MS : TYPE_MS
    let next = state
    if (!del && n < word.length) next = { i, n: n + 1, del }
    else if (!del) {
      next = { i, n, del: true }
      delay = HOLD_MS
    } else if (n > 0) next = { i, n: n - 1, del }
    else {
      next = { i: (i + 1) % phrases.length, n: 0, del: false }
      delay = NEXT_MS
    }
    const t = window.setTimeout(() => setState(next), delay)
    return () => window.clearTimeout(t)
  }, [state, phrases])

  const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a))
  return (
    <span className={s.typeLine}>
      <span className={s.typeSizer} aria-hidden="true">
        {longest}
      </span>
      <span className={s.typed} aria-hidden="true">
        {phrases[state.i].slice(0, state.n)}
        <span className={s.caret} />
      </span>
      <span className="sr-only">{phrases[0]}</span>
    </span>
  )
}
