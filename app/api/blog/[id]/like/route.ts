import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authConfig'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (session.user as any).id

  if (!userId) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  const { id: blogId } = await params

  const existingLike = await prisma.like.findFirst({
    where: {
      userId,
      blogId,
    },
  })

  let liked: boolean

  if (existingLike) {
    // Unlike
    await prisma.like.delete({
      where: { id: existingLike.id },
    })
    liked = false
  } else {
    // Like
    await prisma.like.create({
      data: {
        userId,
        blogId,
      },
    })
    liked = true
  }

  return NextResponse.json({ liked })
}
