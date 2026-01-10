import { prisma } from '@/lib/prisma'
import Navigation from '../components/Navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import HomeClient from './HomeClient'
import type { BlogDTO, CurrentUserSafe, SuggestUserDTO } from '@/types/dto'
import { Prisma } from '@prisma/client'
import { redis } from '@/lib/redis'

const FEED_LIMIT = 6
const FEED_CACHE_TTL = 300 // 5 phút

// Lấy người dùng hiện tại từ NextAuth session
async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, fullname: true, username: true, image: true },
  })
}

export default async function HomePage() {
  const currentUser = await getCurrentUser()
  const currentUserId = currentUser?.id

  /* =====================
     USER SUGGESTION
  ====================== */
  // Fetch users chưa follow, có _count.followers
  const usersRaw = await prisma.user.findMany({
    where: currentUserId
      ? {
        AND: [
          { id: { not: currentUserId } },
          { followers: { none: { followerId: currentUserId } } },
        ],
      }
      : undefined,
    select: {
      id: true,
      fullname: true,
      username: true,
      image: true,
      followers: currentUser
        ? { select: { followerId: true }, where: { followerId: currentUser.id } }
        : undefined,
      _count: {
        select: {
          followers: true,
        },
      },
    },
    take: 50, // Fetch nhiều hơn để sort và lấy top 5
  })

  // Sort theo số lượng followers từ cao xuống thấp, lấy top 5
  const users = usersRaw
    .sort((a, b) => (b._count.followers ?? 0) - (a._count.followers ?? 0))
    .slice(0, 5)

  /* =====================
     BLOG FEED (TỐI ƯU VỚI REDIS CACHE)
  ====================== */
  const feedCacheKey = 'feed:initial:server'
  let blogs: any[] = []

  // 1️⃣ KIỂM TRA REDIS CACHE TRƯỚC
  let cacheHit = false
  try {
    const cachedFeed = await redis.get(feedCacheKey)
    
    if (cachedFeed) {
      // Cache hit
      const parsed = typeof cachedFeed === 'string' 
        ? JSON.parse(cachedFeed) 
        : cachedFeed
      if (Array.isArray(parsed) && parsed.length > 0) {
        blogs = parsed
        cacheHit = true
      }
    }
  } catch (error) {
    console.error('Redis cache read error:', error)
    // Fallback: query DB nếu Redis lỗi
  }

  // 2️⃣ NẾU CACHE MISS → QUERY DB
  if (!cacheHit) {
    const authorSelect: Prisma.UserSelect = {
      id: true,
      fullname: true,
      username: true,
      image: true,
    }
    if (currentUser) {
      authorSelect.followers = {
        select: { followerId: true },
        where: { followerId: currentUser.id },
      }
    }

    const blogSelect: Prisma.BlogSelect = {
      id: true,
      caption: true,
      imageUrls: true,
      createdAt: true,
      author: { select: authorSelect },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      sharedFrom: {
        select: {
          id: true,
          caption: true,
          imageUrls: true,
          createdAt: true,
          author: { select: { id: true, fullname: true, username: true, image: true } },
          _count: { select: { likes: true, comments: true } },
        },
      },
    }

    if (currentUserId) {
      blogSelect.likes = {
        where: { userId: currentUserId },
        select: { userId: true },
        take: 1,
      }
      blogSelect.savedBy = {
        where: { userId: currentUserId },
        select: { userId: true },
        take: 1,
      }
    }

    blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
      take: FEED_LIMIT,
      select: blogSelect,
    })

    // 3️⃣ LƯU VÀO REDIS (sau khi serialize dates)
    try {
      const blogsForCache = blogs.map((b) => ({
        ...b,
        createdAt: b.createdAt instanceof Date ? b.createdAt.toISOString() : b.createdAt,
        sharedFrom: b.sharedFrom
          ? {
              ...b.sharedFrom,
              createdAt: b.sharedFrom.createdAt instanceof Date 
                ? b.sharedFrom.createdAt.toISOString() 
                : b.sharedFrom.createdAt,
            }
          : null,
      }))
      await redis.set(feedCacheKey, JSON.stringify(blogsForCache), { ex: FEED_CACHE_TTL })
    } catch (error) {
      console.error('Redis cache write error:', error)
      // Không throw, chỉ log lỗi
    }
  }

  // 4️⃣ ĐẢM BẢO DATES LÀ STRING (cho cả cache hit và miss)
  // Nếu từ cache, dates đã là string rồi
  // Nếu từ DB, cần convert Date → string

  /* =====================
     SERIALIZE DATE (đảm bảo dates là string cho cả cache hit và miss)
  ====================== */
  const blogsDto: BlogDTO[] = blogs.map((b) => ({
    ...b,
    createdAt: typeof b.createdAt === 'string' 
      ? b.createdAt 
      : (b.createdAt instanceof Date ? b.createdAt.toISOString() : new Date(b.createdAt).toISOString()),
    isSaved: !!(currentUserId && (b.savedBy?.length ?? 0) > 0),
    sharedFrom: b.sharedFrom
      ? {
          ...b.sharedFrom,
          createdAt: typeof b.sharedFrom.createdAt === 'string'
            ? b.sharedFrom.createdAt
            : (b.sharedFrom.createdAt instanceof Date 
                ? b.sharedFrom.createdAt.toISOString() 
                : new Date(b.sharedFrom.createdAt).toISOString()),
        }
      : null,
  }))

  return (
    <div className="min-h-screen bg-[#0B0E11]">
      <Navigation />
      <HomeClient
        blogs={blogsDto}
        users={users as SuggestUserDTO[]}
        currentUser={currentUser as CurrentUserSafe}
      />
    </div>
  )
}
