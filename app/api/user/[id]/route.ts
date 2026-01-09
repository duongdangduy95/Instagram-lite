import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Prisma } from '@prisma/client'
import { redis } from '@/lib/redis'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const currentUserId = session?.user?.id || 'guest'

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') || ''
    const cursor = searchParams.get('cursor') || 'null'
    const limit = parseInt(searchParams.get('limit') || '6', 10)

    // ===============================
    // 🔑 REDIS CACHE KEY
    // ===============================
    const cacheKey = `user_search:${currentUserId}:${query}:${cursor}:${limit}`

    // ===============================
    // 🚀 TRY REDIS FIRST
    // ===============================
    const cached = await redis.get<typeof response>(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    // ===============================
    // BUILD WHERE CLAUSE
    // ===============================
    const whereClause: Prisma.UserWhereInput = {}

    if (query.trim()) {
      whereClause.OR = [
        { username: { contains: query, mode: 'insensitive' } },
        { fullname: { contains: query, mode: 'insensitive' } }
      ]
    }

    if (currentUserId !== 'guest') {
      whereClause.NOT = { id: currentUserId }
    }

    const cursorCondition =
      cursor !== 'null' ? { id: { lt: cursor } } : {}

    const users = await prisma.user.findMany({
      where: {
        ...whereClause,
        ...cursorCondition
      },
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

    const hasMore = users.length > limit
    const data = hasMore ? users.slice(0, limit) : users
    const nextCursor = hasMore ? data[data.length - 1].id : null

    // ===============================
    // FOLLOW STATUS
    // ===============================
    let usersWithFollowStatus = data

    if (currentUserId !== 'guest') {
      const userIds = data.map(u => u.id)

      const followStatuses = await prisma.follow.findMany({
        where: {
          followerId: currentUserId,
          followingId: { in: userIds }
        },
        select: { followingId: true }
      })

      const followingSet = new Set(
        followStatuses.map(f => f.followingId)
      )

      usersWithFollowStatus = data.map(user => ({
        ...user,
        isFollowing: followingSet.has(user.id)
      }))
    } else {
      usersWithFollowStatus = data.map(user => ({
        ...user,
        isFollowing: false
      }))
    }

    const response = {
      data: usersWithFollowStatus,
      nextCursor
    }

    // ===============================
    // 💾 SAVE TO REDIS (TTL 60s)
    // ===============================
    await redis.set(cacheKey, response, {
      ex: 6000
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('User search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
