import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createNotification } from '@/lib/notification'
import { NotificationType } from '@prisma/client'

async function getCurrentUserId() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null
  return session.user.id
}

/* ================= GET COMMENTS ================= */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: blogId } = await params
  const userId = await getCurrentUserId()

  const comments = await prisma.comment.findMany({
    where: { blogId },
    include: {
      author: {
        select: { fullname: true, username: true, image: true },
      },
      likes: userId
        ? {
            where: { userId },
            select: { id: true },
          }
        : false,
      _count: {
        select: { likes: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  const result = comments.map((c) => ({
    id: c.id,
    blogId: c.blogId,
    content: c.content,
    createdAt: c.createdAt,
    parentId: c.parentId,
    author: c.author,
    likeCount: c._count.likes,
    liked: userId ? c.likes.length > 0 : false,
  }))

  return NextResponse.json(result)
}

/* ================= CREATE COMMENT ================= */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: blogId } = await params
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { content, parentId } = await req.json()
  if (!content) {
    return NextResponse.json({ error: 'Missing content' }, { status: 400 })
  }

  try {
    // Lấy blog để biết author
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: { authorId: true },
    })

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: userId,
        blogId,
        parentId: parentId || null,
      },
      include: {
        author: {
          select: {
            fullname: true,
            username: true,
            image: true,
          },
        },
      },
    })

    // 🔔 NOTIFY CHỦ BLOG
    if (blog.authorId !== userId) {
      await createNotification({
        userId: blog.authorId,
        actorId: userId,
        type: NotificationType.COMMENT_POST,
        blogId,
        commentId: comment.id,
      })
    }

    return NextResponse.json(comment)
  } catch (err) {
    console.error('API ERROR:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
