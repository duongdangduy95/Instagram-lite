import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redis } from '@/lib/redis'

const PAGE_SIZE = 3
const FEED_TTL = 300 // Tăng lên 60s để thấy rõ hiệu quả cache

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const { searchParams } = new URL(req.url)
  const cursor = searchParams.get('cursor') // Cursor-based pagination

  // Cache key theo cursor (hoặc 'initial' cho lần đầu)
  const feedCacheKey = cursor ? `feed:cursor:${cursor}` : 'feed:initial'

  try {
    let feed: any[] = []

    // 1️⃣ KIỂM TRA REDIS TRƯỚC
    const cachedData = await redis.get(feedCacheKey)
    
    if (cachedData) {
      // Upstash tự động parse JSON nếu bạn dùng SDK mới, 
      // nhưng an toàn nhất là kiểm tra kiểu dữ liệu
      const parsed = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData
      
      // Backward compatibility: nếu là array cũ thì dùng trực tiếp
      if (Array.isArray(parsed)) {
        feed = parsed.filter(b => !b.isdeleted)
      } else if (parsed && typeof parsed === 'object' && 'feed' in parsed) {
        // Cấu trúc mới với nextCursor
        feed = (parsed.feed || []).filter(b => !b.isdeleted)
      } else {
        feed = []
      }
      console.log(`--- Cache Hit: ${feedCacheKey} ---`)
    } else {
      console.log(`--- Cache Miss: Querying Prisma ---`)
      // 🔥 Feed chung cho mọi người dùng để tối ưu dung lượng Redis
      // Cursor-based pagination: dùng cursor thay vì skip/take
      const blogs = await prisma.blog.findMany({
        take: PAGE_SIZE + 1, // Lấy thêm 1 để check có next page không
        ...(cursor ? {
          cursor: { id: cursor },
          skip: 1, // Bỏ qua post có id = cursor (vì đã có rồi)
        } : {}),
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        where: { isdeleted: false },
        select: {
          id: true,
          caption: true,
          imageUrls: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              fullname: true,
              username: true,
              image: true,
            },
          },
          sharedFrom: {
            select: {
              id: true,
              caption: true,
              imageUrls: true,
              createdAt: true,
              author: {
                select: {
                  id: true,
                  fullname: true,
                  username: true,
                  image: true,
                },
              },
              _count: {
                select: { likes: true, comments: true },
              },
            },
          },
          _count: {
            select: { likes: true, comments: true },
          },
        },
      })

      // Kiểm tra có next page không (nếu lấy được PAGE_SIZE + 1 items)
      const hasNextPage = blogs.length > PAGE_SIZE
      if (hasNextPage) {
        blogs.pop() // Bỏ item thừa
      }

      // Chuẩn hóa Date thành String để lưu vào Redis không bị lỗi
      feed = blogs.map((b) => ({
        ...b,
        createdAt: b.createdAt.toISOString(),
        sharedFrom: b.sharedFrom
          ? { ...b.sharedFrom, createdAt: b.sharedFrom.createdAt.toISOString() }
          : null,
      }))

      // Lưu thêm metadata về next cursor vào cache
      const feedForCache = feed.filter(b => !b.isdeleted)
      const cacheData = {
        feed: feedForCache,
        nextCursor: hasNextPage ? feedForCache[feedForCache.length - 1]?.id : null,
      }

      // LƯU VÀO REDIS (Dùng cấu trúc object cho options)
      await redis.set(feedCacheKey, JSON.stringify(cacheData), { ex: FEED_TTL })
    }

    if (!feed || feed.length === 0) {
      return NextResponse.json([])
    }

    // 2️⃣ LOAD TRẠNG THÁI CÁ NHÂN (Like, Save, Follow)
    // Phần này không cache vì mỗi User mỗi khác, nhưng query theo List ID nên rất nhanh
    const blogIds = feed.map((b) => b.id)
    const authorIds = Array.from(new Set(feed.map((b) => b.author.id)))

    const [likes, saved, follows] = await Promise.all([
      prisma.like.findMany({
        where: { userId, blogId: { in: blogIds } },
        select: { blogId: true },
      }),
      prisma.savedPost.findMany({
        where: { userId, blogId: { in: blogIds } },
        select: { blogId: true },
      }),
      prisma.follow.findMany({
        where: {
          followerId: userId,
          followingId: { in: authorIds },
        },
        select: { followingId: true },
      }),
    ])

    const likedSet = new Set(likes.map((l) => l.blogId))
    const savedSet = new Set(saved.map((s) => s.blogId))
    const followSet = new Set(follows.map((f) => f.followingId))

    // 3️⃣ MERGE DỮ LIỆU
    const result = feed.map((b) => ({
      ...b,
      liked: likedSet.has(b.id),
      isSaved: savedSet.has(b.id),
      author: {
        ...b.author,
        isFollowing: followSet.has(b.author.id),
      },
    }))

    // Tính nextCursor từ result cuối cùng
    const nextCursor = result.length > 0 ? result[result.length - 1]?.id : null

    return NextResponse.json(result)

  } catch (e) {
    console.error('HOME API ERROR:', e)
    return NextResponse.json({ error: 'Failed to load home' }, { status: 500 })
  }
}