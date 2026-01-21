import { NextResponse } from 'next/server'

const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing'
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'

async function getAccessToken() {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token || '',
    }),
  })

  return response.json()
}

async function getNowPlaying() {
  const { access_token } = await getAccessToken()

  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
}

export async function GET() {
  try {
    // Check if credentials are configured
    if (!client_id || !client_secret || !refresh_token) {
      return NextResponse.json(
        { isPlaying: false, error: 'Spotify credentials not configured' },
        { status: 200 }
      )
    }

    const response = await getNowPlaying()

    // No content - nothing playing
    if (response.status === 204 || response.status > 400) {
      return NextResponse.json({ isPlaying: false })
    }

    const song = await response.json()

    // Check if it's actually playing
    if (!song.is_playing) {
      return NextResponse.json({ isPlaying: false })
    }

    // Check if it's a track (not podcast, etc.)
    if (song.currently_playing_type !== 'track') {
      return NextResponse.json({ isPlaying: false })
    }

    const isPlaying = song.is_playing
    const title = song.item.name
    const artist = song.item.artists.map((a: { name: string }) => a.name).join(', ')
    const album = song.item.album.name
    const albumImageUrl = song.item.album.images[0]?.url
    const songUrl = song.item.external_urls.spotify
    const progress = song.progress_ms
    const duration = song.item.duration_ms

    return NextResponse.json({
      isPlaying,
      title,
      artist,
      album,
      albumImageUrl,
      songUrl,
      progress,
      duration,
    })
  } catch (error) {
    console.error('Spotify API error:', error)
    return NextResponse.json(
      { isPlaying: false, error: 'Failed to fetch now playing' },
      { status: 200 }
    )
  }
}
