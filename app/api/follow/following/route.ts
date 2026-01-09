import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        const currentUserId = session?.user?.id

        if (!currentUserId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get users that current user is following
        const following = await prisma.follow.findMany({
            where: {
                followerId: currentUserId
            },
            select: {
                following: {
                    select: {
                        id: true,
                        username: true,
                        fullname: true,
                        image: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        const users = following.map(f => f.following)

        return NextResponse.json(users)

    } catch (error) {
        console.error('Get following error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
