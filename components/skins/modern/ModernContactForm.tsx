'use client'

// "06 Contact" form. On submit the button turns into "Sent ✓" with a confirmation line (README).
import { useFormPost } from '@/components/site/useFormPost'
import s from './OHome.module.css'

export default function ModernContactForm() {
  const { submit, sent, sending, error } = useFormPost('/api/contact')
  return (
    <form className={s.form} onSubmit={submit} noValidate={false}>
      <label className={`${s.field} ${s.deskOnly}`}>
        NAME
        <input className={s.input} type="text" name="name" autoComplete="name" placeholder="Your name" />
      </label>
      <label className={s.field}>
        <span className={s.deskOnly}>EMAIL</span>
        <input
          className={s.input}
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="you@somewhere.com"
          aria-label="Email"
        />
      </label>
      <label className={`${s.field} ${s.wide}`}>
        <span className={s.deskOnly}>MESSAGE</span>
        <textarea
          className={`${s.input} ${s.textarea}`}
          name="message"
          rows={4}
          required
          placeholder="Photographs, hardware or a pair of jeans…"
          aria-label="Message"
        />
      </label>
      <input className={s.trap} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button type="submit" className={s.send} disabled={sending}>
        <span>{sent ? 'Sent' : sending ? 'Sending…' : 'Send message'}</span>
        <span aria-hidden="true">{sent ? '✓' : '→'}</span>
      </button>
      <p className={s.formNote} role="status" aria-live="polite">
        {sent ? "Thanks — it's in. I reply within a week." : error}
      </p>
    </form>
  )
}
