import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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

  // check comment thuộc blog
  const comment = await prisma.comment.findFirst({
    where: { id: commentId, blogId },
    select: { id: true },
  })

  if (!comment) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
  }

  // toggle like trong transaction
  const result = await prisma.$transaction(async (tx) => {
    const existing = await tx.like.findFirst({
      where: {
        userId,
        commentId,
      },
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
    }

    const likeCount = await tx.like.count({
      where: { commentId },
    })

    return { liked, likeCount }
  })

  return NextResponse.json(result)
}
