// app/api/hashtag/[name]/blogs/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params
    const hashtagName = name.toLowerCase()

    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get('limit') ?? 10)

    const blogs = await prisma.blog.findMany({
      where: {
        blogHashtags: {
          some: {
            hashtag: {
              name: hashtagName,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        author: true,
        likes: true,
        comments: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    return NextResponse.json({
      hashtag: hashtagName,
      count: blogs.length,
      blogs,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to fetch blogs by hashtag' },
      { status: 500 }
    )
  }
}
