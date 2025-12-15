import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Lấy danh sách followers hoặc following
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; type: string }> }
) {
  try {
    const { userId, type } = await params

    if (type === 'followers') {
      // Lấy danh sách người theo dõi
      const followers = await prisma.follow.findMany({
        where: { followingId: userId },
        include: {
          follower: {
            select: {
              id: true,
              username: true,
              fullname: true,
            },
          },
        },
      })

      return NextResponse.json({
        users: followers.map(f => f.follower),
      })
    } else if (type === 'following') {
      // Lấy danh sách đang theo dõi
      const following = await prisma.follow.findMany({
        where: { followerId: userId },
        include: {
          following: {
            select: {
              id: true,
              username: true,
              fullname: true,
            },
          },
        },
      })

      return NextResponse.json({
        users: following.map(f => f.following),
      })
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error fetching follow list:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}