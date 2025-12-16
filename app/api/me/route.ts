import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'  // hoặc tạo PrismaClient trực tiếp

export async function GET() {
  const cookieStore = cookies()
  const session = (await cookieStore).get('session')?.value

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: no session' }, { status: 401 })
  }

  const userId = (session.user as any).id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      blogs: { orderBy: { createdAt: 'desc' } },
      likes: {
        include: {
          blog: {
            include: {
              author: true,
            },
          },
        },
      },
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json(user)
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (session.user as any).id
  const { fullname, email, phone } = await req.json()

  try {
    // Kiểm tra email đã tồn tại không (nếu thay đổi)
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })
      
      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json(
          { error: 'Email đã được sử dụng' },
          { status: 409 }
        )
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullname && { fullname }),
        ...(email && { email }),
        ...(phone && { phone }),
      },
      include: {
        blogs: { orderBy: { createdAt: 'desc' } },
        likes: {
          include: {
            blog: {
              include: {
                author: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
