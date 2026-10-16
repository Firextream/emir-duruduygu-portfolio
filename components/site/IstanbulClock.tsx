'use client'

// Istanbul time (HH:MM), refreshed every 20 s. Renders "--:--" on the server and on the first
// client render so hydration always matches; the real time fills in after mount.
import { useEffect, useState } from 'react'

const format = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Istanbul',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

export default function IstanbulClock({ className }: { className?: string }) {
  const [time, setTime] = useState('--:--')
  useEffect(() => {
    const tick = () => setTime(format.format(new Date()))
    tick()
    const id = window.setInterval(tick, 20_000)
    return () => window.clearInterval(id)
  }, [])
  return (
    <time className={className} aria-label={time === '--:--' ? undefined : `Istanbul time ${time}`}>
      {time}
    </time>
  )
}
