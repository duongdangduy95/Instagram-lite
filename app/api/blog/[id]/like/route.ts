import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const cookieStore = await cookies() // ✅ Phải await
  console.log('All cookies:', cookieStore.getAll())

  const session = cookieStore.get('session') // ✅ OK rồi
  console.log('Session cookie:', session)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [userId] = session.value.split(':')

  if (!userId) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  const blogId = params.id

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
