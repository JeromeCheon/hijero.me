import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'hijero.me'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const fontData = await fetch(
    'https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gozFl7F3A.woff2'
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    <div
      style={{
        background: '#0a0a0a',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '80px',
        fontFamily: 'Space Grotesk',
      }}
    >
      <p
        style={{
          fontSize: 80,
          fontWeight: 700,
          color: '#ffffff',
          margin: 0,
          letterSpacing: '-2px',
          lineHeight: 1,
        }}
      >
        hijero.me
      </p>
      <p
        style={{
          fontSize: 32,
          fontWeight: 400,
          color: '#a3a3a3',
          margin: '24px 0 0',
          lineHeight: 1.4,
        }}
      >
        Full-stack developer Jerome&apos;s blog
      </p>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: 'Space Grotesk',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  )
}
