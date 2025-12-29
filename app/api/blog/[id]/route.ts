import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: blogId } = await params
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id

  try {
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: {
        id: true,
        caption: true,
        imageUrls: true,
        createdAt: true,

        author: {
          select: {
            id: true,
            fullname: true,
            username: true,
          },
        },

        sharedFrom: {
          select: {
            id: true,
            caption: true,
            imageUrls: true,
            author: {
              select: {
                id: true,
                fullname: true,
                username: true,
              },
            },
            _count: {
              select: {
                likes: true,
                
              },
            },
          },
        },

        _count: {
          select: {
            likes: true,
            
          },
        },

        likes: currentUserId
          ? {
              where: { userId: currentUserId },
              select: { id: true },
            }
          : false,
      },
    })

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...blog,
      liked: blog.likes?.length > 0,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
