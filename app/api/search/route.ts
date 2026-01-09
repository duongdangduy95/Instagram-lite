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
  `user_search:${q || 'all'}:${cursor || 'null'}:${limit}`

/* ==============================
   GET
============================== */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const currentUserId = session?.user?.id || null

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')?.trim() || ''
    const cursor = searchParams.get('cursor')
    const limit = parseInt(searchParams.get('limit') || '6', 10)

    /* ==============================
       REDIS FIRST (RAW USERS)
    ============================== */
    const redisKey = searchKey(query, cursor, limit)
    const cached = await redis.get(redisKey)

    let users: any[]
    let nextCursor: string | null

    if (cached) {
      ;({ users, nextCursor } = cached as any)
    } else {
      /* ==============================
         BUILD WHERE
      ============================== */
      const whereClause: Prisma.UserWhereInput = {}

      if (query) {
        whereClause.OR = [
          { username: { contains: query, mode: 'insensitive' } },
          { fullname: { contains: query, mode: 'insensitive' } }
        ]
      }

      if (currentUserId) {
        whereClause.NOT = { id: currentUserId }
      }

      if (cursor) {
        whereClause.id = { lt: cursor }
      }

      const result = await prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          username: true,
          fullname: true,
          image: true,
          _count: {
            select: {
              followers: true,
              following: true
            }
          }
        },
        orderBy: { id: 'desc' },
        take: limit + 1
      })

      const hasMore = result.length > limit
      users = hasMore ? result.slice(0, limit) : result
      nextCursor = hasMore ? users[users.length - 1].id : null

      // 🔥 CACHE RAW USERS
      await redis.set(
        redisKey,
        { users, nextCursor },
        { ex: 90 } // 90s
      )
    }

    /* ==============================
       FOLLOW STATUS (USER-SPECIFIC)
    ============================== */
    let usersWithFollowStatus = users

    if (currentUserId && users.length > 0) {
      const ids = users.map(u => u.id)

      const follows = await prisma.follow.findMany({
        where: {
          followerId: currentUserId,
          followingId: { in: ids }
        },
        select: { followingId: true }
      })

      const followingSet = new Set(follows.map(f => f.followingId))

      usersWithFollowStatus = users.map(user => ({
        ...user,
        isFollowing: followingSet.has(user.id)
      }))
    } else {
      usersWithFollowStatus = users.map(user => ({
        ...user,
        isFollowing: false
      }))
    }

    return NextResponse.json({
      data: usersWithFollowStatus,
      nextCursor
    })
  } catch (error) {
    console.error('User search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
