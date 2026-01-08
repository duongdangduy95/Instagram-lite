import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Prisma } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const currentUserId = session?.user?.id

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') || ''
    const cursor = searchParams.get('cursor')
    const limit = parseInt(searchParams.get('limit') || '6', 10)

    const whereClause: Prisma.UserWhereInput = {}

    // If there's a search query, filter by username or fullname
    if (query.trim()) {
      whereClause.OR = [
        { username: { contains: query, mode: 'insensitive' } },
        { fullname: { contains: query, mode: 'insensitive' } }
      ]
    }

    // Exclude current user from results
    if (currentUserId) {
      whereClause.NOT = { id: currentUserId }
    }

    // Build cursor condition
    const cursorCondition = cursor ? { id: { lt: cursor } } : {}

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
      take: limit + 1 // Take one extra to check if there's more
    })

    const hasMore = users.length > limit
    const data = hasMore ? users.slice(0, limit) : users
    const nextCursor = hasMore ? data[data.length - 1].id : null

    // Get follow status for each user if logged in
    let usersWithFollowStatus = data

    if (currentUserId) {
      const userIds = data.map(u => u.id)
      const followStatuses = await prisma.follow.findMany({
        where: {
          followerId: currentUserId,
          followingId: { in: userIds }
        },
        select: { followingId: true }
      })

      const followingSet = new Set(followStatuses.map(f => f.followingId))

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

    return NextResponse.json({
      data: usersWithFollowStatus,
      nextCursor
    })

  } catch (error) {
    console.error('User search error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}