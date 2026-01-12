import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Prisma } from '@prisma/client'
import { Redis } from '@upstash/redis'

/* ==============================
   REDIS
============================== */
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const searchKey = (q: string, cursor: string | null, limit: number) =>
  `blog_search:${q || 'all'}:${cursor || 'null'}:${limit}`

/* ==============================
   GET - Search Blogs with Full Text Search
============================== */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const currentUserId = session?.user?.id || null

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')?.trim() || ''
    const cursor = searchParams.get('cursor')
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      )
    }

    /* ==============================
       REDIS CACHE
    ============================== */
    const redisKey = searchKey(query, cursor, limit)
    const cached = await redis.get(redisKey)

    let blogs: any[]
    let nextCursor: string | null

    if (cached) {
      ;({ blogs, nextCursor } = cached as any)
    } else {
      /* ==============================
         BUILD WHERE CLAUSE
         Sử dụng full text search với search_vector hoặc fallback về caption_unaccent
      ============================== */
      const whereClause: Prisma.BlogWhereInput = {
        isdeleted: false,
        sharedFromId: null, // Chỉ search bài viết gốc, không search shared posts
      }

      // Full text search: search theo caption và tên tác giả (username/fullname)
      if (query) {
        // Escape query để tránh SQL injection khi dùng raw query
        const escapedQuery = query.replace(/[%_\\]/g, '\\$&')
        
        whereClause.OR = [
          // Tìm trong caption_unaccent nếu có (tốt hơn cho tiếng Việt)
          { caption_unaccent: { contains: escapedQuery, mode: 'insensitive' } },
          // Fallback về caption nếu caption_unaccent null
          { 
            AND: [
              { caption_unaccent: null },
              { caption: { contains: escapedQuery, mode: 'insensitive' } }
            ]
          },
          // Tìm trong caption trực tiếp (backup)
          { caption: { contains: escapedQuery, mode: 'insensitive' } },
          // Tìm theo tên tác giả (username)
          { author: { username: { contains: escapedQuery, mode: 'insensitive' } } },
          // Tìm theo tên đầy đủ của tác giả (fullname)
          { author: { fullname: { contains: escapedQuery, mode: 'insensitive' } } }
        ]
      }

      if (cursor) {
        whereClause.id = { lt: cursor }
      }

      const result = await prisma.blog.findMany({
        where: whereClause,
        select: {
          id: true,
          caption: true,
          imageUrls: true,
          music: true,
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
              music: true,
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
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: limit + 1,
      })

      const hasMore = result.length > limit
      blogs = hasMore ? result.slice(0, limit) : result
      nextCursor = hasMore ? blogs[blogs.length - 1].id : null

      // Parse music JSON nếu là string
      blogs = blogs.map((blog) => ({
        ...blog,
        createdAt: blog.createdAt.toISOString(),
        music: typeof blog.music === 'string' ? JSON.parse(blog.music) : blog.music,
        sharedFrom: blog.sharedFrom
          ? {
              ...blog.sharedFrom,
              createdAt: blog.sharedFrom.createdAt.toISOString(),
              music:
                typeof blog.sharedFrom.music === 'string'
                  ? JSON.parse(blog.sharedFrom.music)
                  : blog.sharedFrom.music,
            }
          : null,
      }))

      // 🔥 CACHE RESULTS
      await redis.set(
        redisKey,
        { blogs, nextCursor },
        { ex: 60 } // 60s cache
      )
    }

    return NextResponse.json(blogs)
  } catch (error) {
    console.error('Blog search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
