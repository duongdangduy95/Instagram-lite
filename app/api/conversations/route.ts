import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json([], { status: 401 })
  }

  const userId = session.user.id

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: { userId }
      }
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullname: true,
              image: true
            }
          }
        }
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  const result = conversations
    .map(c => {
      const other = c.participants.find(
        p => p.userId !== userId
      )

      // ⛔ conversation lỗi – bỏ luôn
      if (!other?.user) return null

      return {
        id: c.id,
        otherUser: other.user,
        lastMessage: c.messages[0]
          ? {
              content: c.messages[0].content,
              createdAt: c.messages[0].createdAt
            }
          : null
      }
    })
    .filter(Boolean) // ⬅️ QUAN TRỌNG

  return NextResponse.json(result)
}
