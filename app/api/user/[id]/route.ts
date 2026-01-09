import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/user/[id] - basic user info (for messaging mobile deep-link)
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, fullname: true, image: true },
  })

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  return NextResponse.json(user)
}

