import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// POST - Follow user
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId: targetUserId } = await params

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

    // Tạo follow mới
    await prisma.follow.create({
      data: {
        followerId: userId,
        followingId: targetUserId,
      },
    })

    // Đếm số followers
    const followersCount = await prisma.follow.count({
      where: { followingId: targetUserId },
    })

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
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId: targetUserId } = await params

    // Xóa follow
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    })

    // Đếm số followers
    const followersCount = await prisma.follow.count({
      where: { followingId: targetUserId },
    })

    return NextResponse.json({ 
      message: 'Unfollow thành công',
      followersCount 
    })
  } catch (error) {
    console.error('Error unfollowing user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}