import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Emir Duruduygu - Photography & Creative Portfolio'
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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        }}
      >
        {/* Decorative line */}
        <div
          style={{
            position: 'absolute',
            top: '60px',
            left: '60px',
            width: '80px',
            height: '2px',
            backgroundColor: '#d4a574',
          }}
        />
        
        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 600,
              color: '#fafafa',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginBottom: '20px',
            }}
          >
            Emir Duruduygu
          </div>
          
          <div
            style={{
              fontSize: 28,
              color: '#d4a574',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '40px',
            }}
          >
            Photography & Creative Portfolio
          </div>
          
          <div
            style={{
              fontSize: 20,
              color: '#888888',
              maxWidth: '600px',
            }}
          >
            Amateur photographer and curious explorer. Architecture, street photography, and everything that catches my eye.
          </div>
        </div>
        
        {/* Bottom decorative line */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            right: '60px',
            width: '80px',
            height: '2px',
            backgroundColor: '#d4a574',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
