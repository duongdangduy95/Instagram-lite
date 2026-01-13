// app/api/hashtag/[name]/blogs/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params
    const hashtagName = name.toLowerCase()

    const session = await getServerSession(authOptions)
    const currentUserId = session?.user?.id

    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get('limit') ?? 10)
    const cursor = searchParams.get('cursor') // Cursor-based pagination

    // Query blogs theo hashtag (giống logic trong page.tsx)
    const blogs = await prisma.blog.findMany({
      where: {
        blogHashtags: {
          some: {
            hashtag: {
              name: hashtagName,
            },
          },
        },
        isdeleted: false, // Chỉ lấy bài chưa bị xóa
      },
      ...(cursor ? {
        cursor: { id: cursor },
        skip: 1, // Bỏ qua post có id = cursor
      } : {}),
      orderBy: { createdAt: 'desc' },
      take: limit + 1, // Lấy thêm 1 để check có next page không
      select: {
        id: true,
        caption: true,
        imageUrls: true,
        music: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            fullname: true,
            username: true,
            image: true,
            followers: currentUserId
              ? { select: { followerId: true }, where: { followerId: currentUserId } }
              : undefined,
          },
        },
        sharedFrom: {
          select: {
            id: true,
            isdeleted: true,
            caption: true,
            imageUrls: true,
            music: true,
            createdAt: true,
            author: { select: { id: true, fullname: true, username: true, image: true } },
            _count: { select: { likes: true, comments: true } },
          },
        },
        _count: { select: { likes: true, comments: true } },
      },
    })

    // Kiểm tra có next page không
    const hasNextPage = blogs.length > limit
    if (hasNextPage) {
      blogs.pop() // Bỏ item thừa
    }

    // Load trạng thái cá nhân (Like, Save) - giống API home
    const blogIds = blogs.map((b) => b.id)
    const [likes, saved] = await Promise.all([
      currentUserId
        ? prisma.like.findMany({
            where: { userId: currentUserId, blogId: { in: blogIds } },
            select: { blogId: true },
          })
        : Promise.resolve([]),
      currentUserId
        ? prisma.savedPost.findMany({
            where: { userId: currentUserId, blogId: { in: blogIds } },
            select: { blogId: true },
          })
        : Promise.resolve([]),
    ])

    const likedSet = new Set(likes.map((l) => l.blogId))
    const savedSet = new Set(saved.map((s) => s.blogId))

    // Serialize và merge trạng thái
    const blogsDto = blogs.map((b) => {
      // Parse music nếu là string
      let parsedMusic = b.music
      if (parsedMusic && typeof parsedMusic === 'string') {
        try {
          parsedMusic = JSON.parse(parsedMusic)
        } catch {
          parsedMusic = null
        }
      }

      // Parse sharedFrom music nếu có
      let parsedSharedFrom = b.sharedFrom
      if (parsedSharedFrom) {
        let parsedSharedMusic = parsedSharedFrom.music
        if (parsedSharedMusic && typeof parsedSharedMusic === 'string') {
          try {
            parsedSharedMusic = JSON.parse(parsedSharedMusic)
          } catch {
            parsedSharedMusic = null
          }
        }

        parsedSharedFrom = {
          ...parsedSharedFrom,
          music: parsedSharedMusic,
          createdAt: parsedSharedFrom.createdAt.toISOString(),
        }
      }

      return {
        ...b,
        music: parsedMusic,
        createdAt: b.createdAt.toISOString(),
        sharedFrom: parsedSharedFrom
          ? {
              ...parsedSharedFrom,
              createdAt: parsedSharedFrom.createdAt.toISOString(),
            }
          : null,
        // Set liked và isSaved giống API home
        liked: currentUserId ? likedSet.has(b.id) : false,
        isSaved: currentUserId ? savedSet.has(b.id) : false,
      }
    })

    return NextResponse.json(blogsDto)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to fetch blogs by hashtag' },
      { status: 500 }
    )
  }
}
