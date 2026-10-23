// Plain rendering of Markdown blocks for short texts (a project's About). Skins style it through
// `className` with descendant selectors; posts have their own skin-specific article renderers.
import ContentImage from '@/components/site/ContentImage'
import Inlines from '@/components/site/Inlines'
import type { Block } from '@/lib/content/types'

export default function Prose({ blocks, className, sizes = '(max-width: 760px) 100vw, 640px' }: { blocks: Block[]; className?: string; sizes?: string }) {
  return (
    <div className={className}>
      {blocks.map((b, i) => {
        if (b.type === 'p')
          return (
            <p key={i}>
              <Inlines>{b.children}</Inlines>
            </p>
          )
        if (b.type === 'h2' || b.type === 'h3')
          return (
            <h3 key={i} id={b.id}>
              {b.text}
            </h3>
          )
        if (b.type === 'quote')
          return (
            <blockquote key={i}>
              <Inlines>{b.children}</Inlines>
            </blockquote>
          )
        if (b.type !== 'figures') return null
        return b.items.map((f, j) => (
          <figure key={`${i}-${j}`}>
            {f.image ? (
              <ContentImage image={f.image} sizes={sizes} />
            ) : (
              <div data-ph="" style={{ aspectRatio: `${f.w} / ${f.h}` }}>
                {f.ratio} · placeholder
              </div>
            )}
            <figcaption>{f.caption}</figcaption>
          </figure>
        ))
      })}
    </div>
  )
}
