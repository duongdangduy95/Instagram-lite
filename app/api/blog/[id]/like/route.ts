import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const { id: blogId } = await params

  try {
    // Tối ưu: Tìm like hiện có (sử dụng unique constraint)
    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        blogId,
        commentId: null,
      },
    })

    let liked: boolean

    if (existingLike) {
      // Unlike - xóa like hiện có
      await prisma.like.delete({
        where: { id: existingLike.id },
      })
      liked = false
    } else {
      // Like - tạo like mới
      await prisma.like.create({
        data: {
          userId,
          blogId,
          commentId: null,
        },
      })
      liked = true
    }

    return NextResponse.json({ liked })
  } catch (error: unknown) {
    // Xử lý lỗi unique constraint nếu có race condition
    const err = error as { code?: string } | null
    if (err?.code === 'P2002') {
      // Nếu đã tồn tại do race condition, thử xóa lại
      try {
        const existingLike = await prisma.like.findFirst({
          where: { userId, blogId },
        })
        if (existingLike) {
          await prisma.like.delete({ where: { id: existingLike.id } })
          return NextResponse.json({ liked: false })
        }
      } catch (retryError) {
        console.error('Retry error:', retryError)
      }
    }
    console.error('Error toggling like:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}