import { prisma } from '@/lib/prisma'
import { redis } from '@/lib/redis'
import { getMeCacheKey } from '@/lib/cache'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const cacheKey = `${await getMeCacheKey(userId)}:saved`

    try {
        // 1) Try cache first
        const cached = await redis.get(cacheKey)
        if (cached) {
            const parsed = typeof cached === 'string' ? JSON.parse(cached) : cached
            if (Array.isArray(parsed)) {
                return NextResponse.json(parsed)
            }
        }

        // 2) Fallback DB
        const savedPosts = await prisma.savedPost.findMany({
            where: {
                userId,
                blog: { isdeleted: false }, // không lấy bài đã xóa
            },
            include: {
                blog: {
                    include: {
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
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        const result = savedPosts
            .filter((sp) => sp.blog !== null)
            .map((sp) => ({
                ...sp.blog!,
                isSaved: true,
            }))

        // 3) Cache result để lần sau nhanh hơn
        try {
            await redis.set(cacheKey, JSON.stringify(result), { ex: 300 })
        } catch {
            // ignore cache errors
        }

        return NextResponse.json(result)
    } catch (error) {
        console.error('Error fetching saved posts:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
