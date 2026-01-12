import { NextResponse } from 'next/server'

/**
 * Proxy API để fetch audio từ Deezer preview URL
 * Giúp tránh CORS issues khi phát nhạc từ client
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 })
  }

  // Validate URL - chỉ cho phép Deezer URLs (bao gồm cả dzcdn.net)
  const isDeezerUrl = url.includes('deezer.com') || 
                      url.includes('dzcdn.net') ||
                      url.startsWith('https://cdns-preview-') ||
                      url.startsWith('https://cdnt-preview-')
  
  if (!isDeezerUrl) {
    return NextResponse.json({ error: 'Invalid URL. Only Deezer preview URLs are allowed.' }, { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.deezer.com/',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch audio', status: response.status },
        { status: response.status }
      )
    }

    // Get audio data
    const arrayBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'audio/mpeg'

    // Return audio với CORS headers
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=3600', // Cache 1 giờ
      },
    })
  } catch (error) {
    console.error('Music proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to proxy audio', detail: (error as Error).message },
      { status: 500 }
    )
  }
}
