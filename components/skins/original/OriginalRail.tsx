'use client'

// The desktop right rail: back to top + GitHub / Instagram / LinkedIn. It lives in its own 56px
// column outside the content gutter, so it can't overlap anything. On Home it fades in once the
// hero has scrolled away (html[data-past], set by ScrollState).
import { usePathname } from 'next/navigation'
import BackToTop from '@/components/site/BackToTop'
import { pageOf } from '@/lib/skins'
import { ArrowUp, Github, Instagram, Linkedin } from './icons'
import s from './OriginalFrame.module.css'

const LINKS = [
  { label: 'GitHub', href: 'https://github.com/Firextream', Icon: Github },
  { label: 'Instagram', href: 'https://www.instagram.com/emir_duruduygu/', Icon: Instagram },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/emir-duruduygu-90800a27a/', Icon: Linkedin },
]

export default function OriginalRail() {
  const home = pageOf(usePathname()) === 'home'
  return (
    <aside className={s.railCol} aria-label="Shortcuts">
      <div className={`${s.rail} ${home ? s.railHome : ''}`}>
        <BackToTop className={s.railTop}>
          <ArrowUp size={20} />
          <span className="sr-only">Back to top</span>
        </BackToTop>
        {LINKS.map(({ label, href, Icon }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={s.railLink}>
            <Icon size={18} />
          </a>
        ))}
      </div>
    </aside>
  )
}
