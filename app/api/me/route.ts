import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      blogs: {
        include: {
          _count: { select: { likes: true, comments: true } },
          likes: { select: { userId: true } },
          author: { select: { id: true, fullname: true, username: true } },
          sharedFrom: {
            include: {
              author: { select: { id: true, fullname: true, username: true } },
              _count: { select: { likes: true, comments: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      likes: {
        include: {
          blog: {
            include: {
              _count: { select: { likes: true, comments: true } },
              likes: { select: { userId: true } },
              author: { select: { id: true, fullname: true, username: true } },
              sharedFrom: {
                include: {
                  author: { select: { id: true, fullname: true, username: true } },
                  _count: { select: { likes: true, comments: true } },
                },
              },
            },
          },
        },
      },
      following: true,
      _count: {
        select: {
          followers: true,
          following: true,
          followers: true,
        },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Map blogs để client dùng imageUrls
  const userWithMappedBlogs = {
    ...user,
    blogs: user.blogs.map(blog => ({
      ...blog,
       imageUrls: blog.imageUrls || [], // imageUrl -> imageUrls
    })),
  }

  return NextResponse.json(userWithMappedBlogs)
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const { fullname, email, phone } = await req.json()

  try {
    // Kiểm tra email đã tồn tại không
    if (email) {
      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json({ error: 'Email đã được sử dụng' }, { status: 409 })
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
        following: true,
        _count: { select: { following: true, followers: true } },
      },
    })

    // Map blogs để client dùng imageUrls
    const updatedUserWithMappedBlogs = {
      ...updatedUser,
      blogs: updatedUser.blogs.map(blog => ({
        ...blog,
        imageUrls: blog.imageUrls ? [blog.imageUrls] : [],
      })),
    }

    return NextResponse.json(updatedUserWithMappedBlogs)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
