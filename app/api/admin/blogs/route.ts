// app/api/admin/blogs/route.ts
// API để load blogs cho admin (không cần user session)
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/admin-auth'

const PAGE_SIZE = 3

export async function GET(req: NextRequest) {
  try {
    // ✅ Verify admin session và check whitelist
    const auth = await verifyAdminSession(req)
    if (!auth.authorized) {
      return auth.response!
    }

    const { searchParams } = new URL(req.url)
    const cursor = searchParams.get('cursor') // Cursor-based pagination

    // Query blogs (giống API /api/home nhưng không cần user session)
    const blogs = await prisma.blog.findMany({
      take: PAGE_SIZE + 1, // Lấy thêm 1 để check có next page không
      ...(cursor ? {
        cursor: { id: cursor },
        skip: 1, // Bỏ qua post có id = cursor (vì đã có rồi)
      } : {}),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      where: { isdeleted: false },
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
            author: {
              select: {
                id: true,
                fullname: true,
                username: true,
                image: true,
              },
            },
            _count: {
              select: { likes: true, comments: true },
            },
          },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    })

    // Kiểm tra có next page không (nếu lấy được PAGE_SIZE + 1 items)
    const hasNextPage = blogs.length > PAGE_SIZE
    if (hasNextPage) {
      blogs.pop() // Bỏ item thừa
    }

    // Chuẩn hóa Date thành String
    const feed = blogs.map((b) => {
      // Parse music nếu là string
      let parsedMusic = b.music
      if (parsedMusic && typeof parsedMusic === 'string') {
        try {
          parsedMusic = JSON.parse(parsedMusic)
        } catch (e) {
          console.error('Failed to parse music JSON:', e)
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
          } catch (e) {
            console.error('Failed to parse sharedFrom music JSON:', e)
            parsedSharedMusic = null
          }
        }

        parsedSharedFrom = {
          ...parsedSharedFrom,
          music: parsedSharedMusic,
        }
      }

      return {
        ...b,
        createdAt: b.createdAt.toISOString(),
        music: parsedMusic,
        sharedFrom: parsedSharedFrom
          ? { ...parsedSharedFrom, createdAt: parsedSharedFrom.createdAt.toISOString() }
          : null,
      }
    })

    return NextResponse.json(feed)

  } catch (e) {
    console.error('ADMIN BLOGS API ERROR:', e)
    return NextResponse.json({ error: 'Failed to load blogs' }, { status: 500 })
  }
}
