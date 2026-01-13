import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { bumpFeedVersion, bumpMeVersion } from '@/lib/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createNotification } from '@/lib/notification'
import { NotificationType } from '@prisma/client'

// POST - Follow user
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: targetUserId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Không thể follow chính mình
    if (userId === targetUserId) {
      return NextResponse.json({ error: 'Không thể follow chính mình' }, { status: 400 })
    }

    // Kiểm tra đã follow chưa
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    })

    if (existingFollow) {
      return NextResponse.json({ error: 'Đã follow người này rồi' }, { status: 400 })
    }

    // Tạo follow mới và đếm followers trong một transaction
    const [, followersCount] = await prisma.$transaction([
      prisma.follow.create({
        data: {
          followerId: userId,
          followingId: targetUserId,
        },
      }),
      prisma.follow.count({
        where: { followingId: targetUserId },
      }),
    ])

    await createNotification({
      userId: targetUserId, 
      actorId: userId,      
      type: NotificationType.FOLLOW,
    })

    // Invalidate cache: home feed + me cache
    await bumpFeedVersion()
    await bumpMeVersion(userId)

    return NextResponse.json({ 
      message: 'Follow thành công',
      followersCount 
    })
  } catch (error) {
    console.error('Error following user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Unfollow user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: targetUserId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Xóa follow và đếm followers trong một transaction
    const [, followersCount] = await prisma.$transaction([
      prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId,
          },
        },
      }),
      prisma.follow.count({
        where: { followingId: targetUserId },
      }),
    ])

    // Invalidate cache: home feed + me cache
    await bumpFeedVersion()
    await bumpMeVersion(userId)

    return NextResponse.json({ 
      message: 'Unfollow thành công',
      followersCount 
    })
  } catch (error) {
    console.error('Error unfollowing user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
