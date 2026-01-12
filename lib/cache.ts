import { redis } from '@/lib/redis'

/**
 * Cache versioning giúp đảm bảo "realtime" (invalidate O(1)) mà vẫn giữ được lợi ích tốc độ từ Redis.
 *
 * Ý tưởng:
 * - Feed cache key = `feed:v<version>:initial|cursor:<id>[:server]`
 * - Me cache key   = `me:v<version>:<userId>`
 *
 * Khi có mutation (create/share/delete...), chỉ cần INCR version tương ứng.
 * Cache cũ sẽ tự hết hạn theo TTL (không cần redis.keys() quét/xoá hàng loạt).
 */

const FEED_VERSION_KEY = 'feed:version'
const ME_VERSION_PREFIX = 'me:version:'

async function getOrInitVersion(key: string, defaultValue = 1) {
  const raw = await redis.get(key)
  const parsed =
    typeof raw === 'string'
      ? Number.parseInt(raw, 10)
      : typeof raw === 'number'
        ? raw
        : null

  if (Number.isFinite(parsed) && (parsed as number) > 0) return parsed as number

  // best-effort init
  try {
    await redis.set(key, String(defaultValue))
  } catch {
    // ignore
  }
  return defaultValue
}

export async function getFeedCacheKey(args?: {
  cursor?: string | null
  server?: boolean
}) {
  const v = await getOrInitVersion(FEED_VERSION_KEY, 1)
  const base = args?.cursor ? `cursor:${args.cursor}` : 'initial'
  return args?.server ? `feed:v${v}:${base}:server` : `feed:v${v}:${base}`
}

export async function bumpFeedVersion() {
  try {
    const next = await redis.incr(FEED_VERSION_KEY)
    return typeof next === 'number' ? next : Number(next)
  } catch (e) {
    console.error('bumpFeedVersion failed', e)
    return null
  }
}

export async function invalidateHomeFeed() {
  // Backward-compatible alias (giữ tên hàm cũ)
  return bumpFeedVersion()
}

export async function getMeCacheKey(userId: string) {
  const v = await getOrInitVersion(`${ME_VERSION_PREFIX}${userId}`, 1)
  return `me:v${v}:${userId}`
}

export async function bumpMeVersion(userId: string) {
  try {
    const next = await redis.incr(`${ME_VERSION_PREFIX}${userId}`)
    return typeof next === 'number' ? next : Number(next)
  } catch (e) {
    console.error('bumpMeVersion failed', e)
    return null
  }
}
