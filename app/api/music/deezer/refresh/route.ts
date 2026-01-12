import { NextResponse } from 'next/server'

/**
 * API để refresh previewUrl từ Deezer trackId
 * Sử dụng khi previewUrl cũ đã hết hạn
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const trackId = searchParams.get('trackId')

  if (!trackId) {
    return NextResponse.json({ error: 'Missing trackId parameter' }, { status: 400 })
  }

  const trackIdNum = Number(trackId)
  if (!Number.isFinite(trackIdNum) || trackIdNum <= 0) {
    return NextResponse.json({ error: 'Invalid trackId' }, { status: 400 })
  }

  try {
    // Fetch track info từ Deezer API
    const url = `https://api.deezer.com/track/${trackIdNum}`
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch track from Deezer', status: res.status },
        { status: res.status }
      )
    }

    const track = (await res.json()) as {
      id?: number
      title?: string
      preview?: string
      artist?: { name?: string }
      album?: { cover_medium?: string; cover?: string }
      duration?: number
    }

    if (!track?.preview) {
      return NextResponse.json(
        { error: 'Track does not have a preview URL' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      provider: 'deezer' as const,
      trackId: track.id ?? trackIdNum,
      title: track.title ?? 'Unknown',
      artist: track.artist?.name ?? 'Unknown',
      previewUrl: track.preview,
      coverUrl: track.album?.cover_medium ?? track.album?.cover ?? null,
      durationSec: typeof track.duration === 'number' ? track.duration : null,
    })
  } catch (error) {
    console.error('Deezer refresh error:', error)
    return NextResponse.json(
      { error: 'Failed to refresh preview URL', detail: (error as Error).message },
      { status: 500 }
    )
  }
}
