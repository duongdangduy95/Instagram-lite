import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

export async function GET() {
  await redis.set('ping', 'pong', { ex: 10 })
  const value = await redis.get('ping')

  return NextResponse.json({
    redis: value,
    env: !!process.env.UPSTASH_REDIS_REST_URL,
  })
}
