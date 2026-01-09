import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const cursor = searchParams.get('cursor')
    const limit = parseInt(searchParams.get('limit') || '9', 10)

    try {
        const blogs = await prisma.blog.findMany({
            take: limit + 1, // Take one extra to check if there are more
            cursor: cursor ? { id: cursor } : undefined,
            skip: cursor ? 1 : 0,
            where: { sharedFromId: null },
            orderBy: { id: 'desc' },
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
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true
                    }
                }
            }
        })

        let nextCursor: string | undefined = undefined
        if (blogs.length > limit) {
            blogs.pop()
            nextCursor = blogs[blogs.length - 1]?.id
        }

        // Map to simple DTO (handling potential nulls/formatting)
        const data = blogs.map((blog) => ({
            ...blog,
            createdAt: blog.createdAt.toISOString(),
            // Ensure sharedFrom structure if used by BlogFeed/Grid, though Explore usually shows main posts
            // For simple grid, we mainly need imageUrls[0]
        }))

        return NextResponse.json({
            data,
            nextCursor
        })

    } catch (error) {
        console.error('Explore feed error:', error)
        return NextResponse.json({ error: 'Failed to fetch explore feed' }, { status: 500 })
    }
}
