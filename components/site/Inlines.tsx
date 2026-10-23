// Renders parsed inline Markdown (lib/content/markdown.ts) — no innerHTML anywhere.
import type { Inline } from '@/lib/content/types'

export default function Inlines({ children }: { children: Inline[] }) {
  return (
    <>
      {children.map((n, i) => {
        if (n.t === 'em') return <em key={i}>{n.v}</em>
        if (n.t === 'strong') return <strong key={i}>{n.v}</strong>
        if (n.t === 'code') return <code key={i}>{n.v}</code>
        if (n.t === 'link') {
          const external = /^https?:\/\//.test(n.href)
          return (
            <a key={i} href={n.href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              {n.v}
            </a>
          )
        }
        return <span key={i}>{n.v}</span>
      })}
    </>
  )
}

/** Plain text of inline nodes (for quotes inside attributes, etc.). */
export const inlineText = (children: Inline[]) => children.map((n) => n.v).join('')
