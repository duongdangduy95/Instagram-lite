import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
//Update like
const prisma = new PrismaClient()

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  const { id: blogId } = await params

  const existingLike = await prisma.like.findFirst({
    where: {
      userId,
      blogId,
    },
  })

  let liked: boolean

  if (existingLike) {
   
    await prisma.like.delete({
      where: { id: existingLike.id },
    })
    liked = false
  } else {
   
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