import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { id: blogId } = await params

    try {
        const existingSave = await (prisma as any).savedPost.findFirst({
            where: {
                userId,
                blogId,
            },
        })

        let saved: boolean

        if (existingSave) {
            await (prisma as any).savedPost.delete({
                where: { id: existingSave.id },
            })
            saved = false
        } else {
            await (prisma as any).savedPost.create({
                data: {
                    userId,
                    blogId,
                },
            })
            saved = true
        }

        return NextResponse.json({ saved })
    } catch (error) {
        console.error('Error toggling save:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
