import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json(null, { status: 401 })
  }

  const notif = await prisma.notification.findUnique({
    where: { id: params.id },
    include: {
      actor: { select: { id: true, username: true, fullname: true, image: true } },
      blog: { select: { id: true } },
      comment: { select: { id: true, blogId: true } },
      message: { select: { id: true, conversationId: true } },
    },
  })

  // đảm bảo user chỉ lấy noti của mình
  if (!notif || notif.userId !== session.user.id) {
    return NextResponse.json(null, { status: 404 })
  }

  return NextResponse.json(notif)
}
