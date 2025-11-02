import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const cookieStore = await cookies() 
  console.log('All cookies:', cookieStore.getAll())

  const session = cookieStore.get('session') 
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
