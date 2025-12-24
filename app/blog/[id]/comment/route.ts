import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: blogId } = await params
  const { userId, content } = await req.json()

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId:userId,
        blogId,
      },
    })

    return NextResponse.json(comment)
  } catch {
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 })
  }
}
