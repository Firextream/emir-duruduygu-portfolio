import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Duruduygu - Photography & Creative Portfolio'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fafafa',
          gap: '60px',
          padding: '60px',
        }}
      >
        {/* Logo Image */}
        <img
          src="https://duruduygu.com/icon-512.jpg"
          alt="Duruduygu Logo"
          width={400}
          height={400}
          style={{
            borderRadius: '8px',
          }}
        />
        
        {/* Text Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 600,
              color: '#0a0a0a',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginBottom: '16px',
            }}
          >
            Duruduygu
          </div>
          
          <div
            style={{
              fontSize: 24,
              color: '#666666',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}
          >
            Photography & Creative Portfolio
          </div>
          
          <div
            style={{
              fontSize: 18,
              color: '#888888',
              maxWidth: '400px',
              lineHeight: 1.5,
            }}
          >
            Amateur photographer and curious explorer. Capturing architecture, street moments, and the unexpected.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
