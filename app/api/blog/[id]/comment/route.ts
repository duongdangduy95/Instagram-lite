import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

async function getCurrentUserId() {
  const session = await getServerSession(authOptions)
  return session?.user?.id ?? null
}

/* =========================
   GET COMMENTS (OPTIMIZED)
========================= */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: blogId } = await params
  const userId = await getCurrentUserId();
  const comments = await prisma.comment.findMany({
    where: { blogId },
    include: {
      author: { select: { fullname: true, username: true } },

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



  return NextResponse.json(result);
}

/* =========================
   POST COMMENT
========================= */
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

  if (!content?.trim()) {
    return NextResponse.json({ error: 'Missing content' }, { status: 400 })
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      blogId,
      authorId: userId,
      parentId: parentId || null,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      parentId: true,
      author: {
        select: {
          fullname: true,
          username: true,
        },
      },
    },
  })

  return NextResponse.json(comment)
}
