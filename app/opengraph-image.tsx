// Default share card. Node.js runtime and no network fetches, so it builds the same on Vercel and in Docker.
import { ImageResponse } from 'next/og'

export const alt = 'Duruduygu — photographs, a journal and a small lab, Istanbul'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          background: '#f3f2f2',
          color: '#201e1d',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, letterSpacing: '0.08em' }}>ISTANBUL · PHOTOGRAPHS · JOURNAL · LAB</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', fontSize: 170, fontWeight: 800, letterSpacing: '-0.06em', lineHeight: 1 }}>
          duruduygu
          <span style={{ color: '#ec3013' }}>.</span>
        </div>
        <div style={{ display: 'flex', height: 8, background: '#ec3013' }} />
      </div>
    ),
    size,
  )
}
