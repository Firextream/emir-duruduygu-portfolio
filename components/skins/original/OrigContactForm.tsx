'use client'

// The About contact form — posts to /api/contact (a stub for now); "Sent ✓" + the confirmation line.
import { useFormPost } from '@/components/site/useFormPost'
import s from './OrigAbout.module.css'

export default function OrigContactForm() {
  const { submit, sent, sending, error } = useFormPost('/api/contact')
  return (
    <form className={s.form} onSubmit={submit}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
      <label className={s.field}>
        <span className={s.label}>NAME</span>
        <input type="text" name="name" required placeholder="Your name" autoComplete="name" className={s.input} />
      </label>
      <label className={s.field}>
        <span className={s.label}>EMAIL</span>
        <input type="email" name="email" required placeholder="your@email.com" autoComplete="email" className={s.input} />
      </label>
      <label className={s.field}>
        <span className={s.label}>MESSAGE</span>
        <textarea name="message" rows={6} required placeholder="Tell me about your project or inquiry..." className={s.textarea} />
      </label>
      <div className={s.sendRow}>
        <button type="submit" className={s.send} disabled={sending}>
          {sent ? 'Sent ✓' : sending ? 'Sending…' : 'Send Message →'}
        </button>
        <p className={s.sendNote} role="status" aria-live="polite">
          {error ?? (sent ? 'Thanks — it’s in. I reply within a week.' : '')}
        </p>
      </div>
    </form>
  )
}
