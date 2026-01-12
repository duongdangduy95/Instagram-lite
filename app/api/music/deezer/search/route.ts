import { NextResponse } from 'next/server'

type DeezerSearchItem = {
  id: number
  title: string
  duration?: number
  preview?: string
  artist?: { name?: string }
  album?: { cover_medium?: string; cover?: string }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').trim()
  const limitRaw = Number(searchParams.get('limit') || 12)
  const indexRaw = Number(searchParams.get('index') || 0)
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(25, limitRaw)) : 12
  const index = Number.isFinite(indexRaw) ? Math.max(0, indexRaw) : 0

  if (!q) {
    return NextResponse.json({ data: [], nextIndex: null, total: 0 })
  }

  try {
    const url = `https://api.deezer.com/search?q=${encodeURIComponent(q)}&index=${index}&limit=${limit}`
    const res = await fetch(url, {
      // Deezer is a public API; keep caching conservative for search UX
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
    })

    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      return NextResponse.json(
        { error: 'Deezer search failed', detail: txt.slice(0, 2000) },
        { status: 502 }
      )
    }

    const json = (await res.json()) as { data?: DeezerSearchItem[]; total?: number }
    const items = Array.isArray(json?.data) ? json.data : []

    const data = items
      .filter((t) => typeof t?.preview === 'string' && !!t.preview)
      .map((t) => ({
        provider: 'deezer' as const,
        trackId: t.id,
        title: t.title,
        artist: t.artist?.name ?? 'Unknown',
        previewUrl: t.preview!,
        coverUrl: t.album?.cover_medium ?? t.album?.cover ?? null,
        durationSec: typeof t.duration === 'number' ? t.duration : null,
      }))

    const total = typeof json?.total === 'number' ? json.total : null
    const nextIndex =
      typeof total === 'number' ? (index + limit < total ? index + limit : null) : (items.length >= limit ? index + limit : null)

    return NextResponse.json({ data, nextIndex, total })
  } catch (e) {
    console.error('Deezer search error:', e)
    return NextResponse.json({ error: 'Deezer search error' }, { status: 500 })
  }
}

