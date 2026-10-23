'use client'

// "Join the journey" — posts to /api/newsletter (a stub for now) and shows the reference's states.
import { useFormPost } from '@/components/site/useFormPost'
import s from './OrigHome.module.css'

export default function OrigNewsletter() {
  const { submit, sent, sending, error } = useFormPost('/api/newsletter')
  return (
    <form className={s.form} onSubmit={submit}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
      <input type="email" name="email" required placeholder="your@email.com" aria-label="Email" autoComplete="email" className={s.input} />
      <button type="submit" className={s.subscribe} disabled={sending}>
        {sent ? 'Subscribed ✓' : sending ? 'Subscribing…' : 'Subscribe →'}
      </button>
      <p className={s.formNote} role="status" aria-live="polite">
        {error ?? (sent ? 'Thanks — the next letter will find you.' : 'No spam, unsubscribe anytime.')}
      </p>
    </form>
  )
}
