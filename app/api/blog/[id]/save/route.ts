import { prisma } from '@/lib/prisma'
import { bumpMeVersion } from '@/lib/cache'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redis } from '@/lib/redis'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { id: blogId } = await params

    try {
        const existingSave = await prisma.savedPost.findFirst({
            where: {
                userId,
                blogId,
            },
        })

        let saved: boolean

        if (existingSave) {
            await prisma.savedPost.delete({
                where: { id: existingSave.id },
            })
            saved = false
        } else {
            await prisma.savedPost.create({
                data: {
                    userId,
                    blogId,
                },
            })
            saved = true
        }

        // Invalidate cache saved list của user
        await bumpMeVersion(userId)
        
        // Invalidate cache blog detail để modal sync đúng khi mở lại
        await redis.del(`blog:detail:${blogId}`)

        return NextResponse.json({ saved })
    } catch (error) {
        console.error('Error toggling save:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
