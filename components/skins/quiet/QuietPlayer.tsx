'use client'

// softsignal.fm — the Quiet home player. Visual only (no audio): play/pause and prev/next work,
// with a track counter and a PAUSED state (README "Quiet home player").
import { useState } from 'react'
import Window from './Window'
import s from './QHome.module.css'

const TRACKS = 12

const Segments = ({ total, lit, className }: { total: number; lit: number; className: string }) => (
  <span className={className} aria-hidden="true">
    {Array.from({ length: total }, (_, i) => (
      <span key={i} className={i < lit ? s.segOn : s.segOff} />
    ))}
  </span>
)

export default function QuietPlayer() {
  const [playing, setPlaying] = useState(true)
  const [track, setTrack] = useState(1)
  const trk = `TRK ${String(track).padStart(2, '0')}`
  return (
    <Window
      icon={<span className={s.accStar}>★</span>}
      title="softsignal.fm"
      meta={<span className={s.deskOnly}>on repeat</span>}
      className={s.player}
      bodyClassName={s.playerBody}
    >
      <div className={s.lcd}>
        <div className={`${s.lcdStatus} ${s.deskOnly}`}>
          <span>{playing ? 'NOW PLAYING' : 'PAUSED'}</span>
          <span>{trk}</span>
        </div>
        <div className={s.lcdTrack}>[track] — [artist]</div>
        <div className={s.lcdRow}>
          <span className={s.lcdTime}>
            <span aria-hidden="true">88:88</span>
            <span className={s.lcdTimeOn}>02:14</span>
          </span>
          <span className={s.lcdTotal}>/ [07:08]</span>
        </div>
        <Segments total={18} lit={7} className={`${s.segs} ${s.deskOnly}`} />
        <Segments total={12} lit={5} className={`${s.segs} ${s.mobOnly}`} />
        <span className="sr-only" aria-live="polite">
          {playing ? 'Playing' : 'Paused'}, track {track} of {TRACKS}
        </span>
      </div>
      <div className={s.controls}>
        <button
          type="button"
          className={`${s.ctl} ${s.deskOnly}`}
          aria-label="Previous track"
          onClick={() => {
            setTrack((t) => (t > 1 ? t - 1 : TRACKS))
            setPlaying(true)
          }}
        >
          ⏮
        </button>
        <button type="button" className={`${s.ctl} ${s.toggle}`} aria-label={playing ? 'Pause' : 'Play'} onClick={() => setPlaying((p) => !p)}>
          {playing ? '⏸' : '▶'}
        </button>
        <button
          type="button"
          className={`${s.ctl} ${s.deskOnly}`}
          aria-label="Next track"
          onClick={() => {
            setTrack((t) => (t < TRACKS ? t + 1 : 1))
            setPlaying(true)
          }}
        >
          ⏭
        </button>
        <span className={`${s.vol} ${s.deskOnly}`} aria-hidden="true">
          VOL ▪▪▪▪▫
        </span>
      </div>
    </Window>
  )
}
