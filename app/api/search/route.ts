import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim() || ''

  if (!q) {
    return NextResponse.json([])
  }

  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  const matched = await prisma.$queryRaw<
    { id: string; rank: number }[]
  >`
    SELECT
      b.id,
      (
        ts_rank(
          b.search_vector,
          plainto_tsquery('simple', unaccent(${q}))
        )
        +
        similarity(b.caption_unaccent, unaccent(${q})) * 0.3
      ) AS rank
    FROM "Blog" b
    JOIN "User" u ON u.id = b."authorId"
    WHERE
      b.search_vector @@ plainto_tsquery('simple', unaccent(${q}))
      OR similarity(b.caption_unaccent, unaccent(${q})) > 0.2
    ORDER BY rank DESC
    LIMIT 50;
  `

  if (matched.length === 0) {
    return NextResponse.json([])
  }

  const matchedIds = matched.map(b => b.id)

  const blogs = await prisma.blog.findMany({
    where: {
      id: { in: matchedIds },
    },
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
          followers: userId
            ? { where: { followerId: userId } }
            : false,
        },
      },

      likes: userId
        ? { where: { userId } }
        : false,

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
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return NextResponse.json(blogs)
}