import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    try {
        const savedPosts = await prisma.savedPost.findMany({
            where: {
                userId,
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

        return NextResponse.json(result)
    } catch (error) {
        console.error('Error fetching saved posts:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
