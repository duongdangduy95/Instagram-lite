import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notification'
import { NotificationType } from '@prisma/client'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const { id: blogId } = await params

  try {
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: { authorId: true },
    })

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    const existingLike = await prisma.like.findFirst({
      where: { userId, blogId },
    })

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } })
      return NextResponse.json({ liked: false })
    }

    await prisma.like.create({
      data: { userId, blogId },
    })

    // 🔔 TẠO NOTIFICATION
    if (blog.authorId !== userId) {
      await createNotification({
        userId: blog.authorId,
        actorId: userId,
        type: NotificationType.LIKE_POST,
        blogId,
      })
    }

    return NextResponse.json({ liked: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
