'use client'

// Shared submit logic for the contact and newsletter forms in every skin.
// Posts the form's fields as JSON; each skin renders its own idle / sending / sent / error states.
import { useState, type FormEvent } from 'react'

export type FormState = 'idle' | 'sending' | 'sent' | 'error'

export function useFormPost(endpoint: '/api/contact' | '/api/newsletter') {
  const [state, setState] = useState<FormState>('idle')
  const [error, setError] = useState<string | null>(null)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (state === 'sending') return
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    setState('sending')
    setError(null)
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!res.ok || !json.ok) throw new Error(json.error || 'Something went wrong. Please try again.')
      setState('sent')
      form.reset()
    } catch (e) {
      setState('error')
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    }
  }

  return { state, error, submit, sent: state === 'sent', sending: state === 'sending' }
}
