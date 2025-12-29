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

  /* 1️⃣ LẤY COMMENT GỐC */
  const parentComments = await prisma.comment.findMany({
    where: {
      blogId,
      parentId: null,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      author: {
        select: {
          fullname: true,
          username: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  if (parentComments.length === 0) {
    return NextResponse.json([])
  }

  const parentIds = parentComments.map((c) => c.id)

  /* 2️⃣ LẤY TOÀN BỘ REPLIES TRONG 1 QUERY */
  const replies = await prisma.comment.findMany({
    where: {
      parentId: { in: parentIds },
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
    orderBy: { createdAt: 'asc' },
  })

  /* 3️⃣ MAP REPLIES VÀO COMMENT CHA */
  const replyMap: Record<string, any[]> = {}
  for (const r of replies) {
    if (!replyMap[r.parentId!]) replyMap[r.parentId!] = []
    replyMap[r.parentId!].push(r)
  }

  const result = parentComments.map((c) => ({
    ...c,
    replies: replyMap[c.id] ?? [],
  }))

  return NextResponse.json(result)
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
