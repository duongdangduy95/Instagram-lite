import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createNotification } from '@/lib/notification'
import { NotificationType } from '@prisma/client'

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string; cmtid: string }> }
) {
  const { id: blogId, cmtid: commentId } = await context.params

  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  // Lấy comment + authorId
  const comment = await prisma.comment.findFirst({
    where: { id: commentId, blogId },
    select: {
      id: true,
      authorId: true,
    },
  })

  if (!comment) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
  }

  const result = await prisma.$transaction(async (tx) => {
    const existing = await tx.like.findFirst({
      where: { userId, commentId },
    })

    let liked: boolean

    if (existing) {
      await tx.like.delete({ where: { id: existing.id } })
      liked = false
    } else {
      await tx.like.create({
        data: {
          userId,
          blogId: null,
          commentId,
        },
      })
      liked = true

      // 🔔 TẠO NOTIFICATION
      if (comment.authorId !== userId) {
        await createNotification({
          userId: comment.authorId,
          actorId: userId,
          type: NotificationType.COMMENT_POST,
          blogId,
          commentId,
        })
      }
    }

    const likeCount = await tx.like.count({
      where: { commentId },
    })

    return { liked, likeCount }
  })

  return NextResponse.json(result)
}
