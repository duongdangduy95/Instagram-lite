import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const PAGE_SIZE = 10

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const cursor = searchParams.get('cursor')

  const blogs = await prisma.blog.findMany({
    take: PAGE_SIZE,
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
    orderBy: [
      { createdAt: 'desc' },
      { id: 'desc' },
    ],
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
          image: true,
          followers: {
            where: { followerId: session.user.id },
            select: { followerId: true },
            take: 1,
          },
        },
      },

      sharedFrom: {
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
              image: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      },

      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },

      likes: {
        where: { userId: session.user.id },
        select: { id: true },
        take: 1,
      },
      savedBy: {
        where: { userId: session.user.id },
        select: { id: true },
        take: 1,
      },
    },
  })

  return NextResponse.json(
    blogs.map((b) => {
      const { likes, savedBy, ...rest } = b
      return {
        ...rest,
        createdAt: b.createdAt.toISOString(),
        sharedFrom: b.sharedFrom
          ? { ...b.sharedFrom, createdAt: b.sharedFrom.createdAt.toISOString() }
          : null,
        liked: likes.length > 0,
        isSaved: savedBy.length > 0,
      }
    })
  )
}
