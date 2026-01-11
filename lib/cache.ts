import { redis } from '@/lib/redis'

export async function invalidateHomeFeed() {
  try {
    // Page đầu là quan trọng nhất
    await redis.del('feed:initial')
  } catch (e) {
    console.error('Invalidate home feed failed', e)
  }
}
