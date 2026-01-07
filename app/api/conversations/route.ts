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
        take: 1,
        select: {
          content: true,
          createdAt: true,
          senderId: true
        }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  const result = await Promise.all(conversations.map(async c => {
    const other = c.participants.find(p => p.userId !== userId)

    // ⛔ conversation lỗi – bỏ luôn
    if (!other?.user) return null

    // Count unread messages (messages sent by other user that are not SEEN)
    const unreadCount = await prisma.message.count({
      where: {
        conversationId: c.id,
        senderId: other.userId,
        status: {
          in: ['SENT', 'DELIVERED']
        }
      }
    })

    // Check if current user is following the other user
    const isFollowing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: other.userId
        }
      }
    })

    // Check if current user has replied (sent any message)
    const hasReplied = await prisma.message.findFirst({
      where: {
        conversationId: c.id,
        senderId: userId
      },
      select: { id: true }
    })

    return {
      id: c.id,
      otherUser: other.user,
      lastMessage: c.messages[0]
        ? {
          content: c.messages[0].content,
          createdAt: c.messages[0].createdAt,
          senderId: c.messages[0].senderId
        }
        : null,
      unreadCount,
      isFollowing: !!isFollowing,
      hasReplied: !!hasReplied
    }
  }))

  return NextResponse.json(result.filter(Boolean))
}

// POST - Create new conversation
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const { targetUserId } = await req.json()
  if (!targetUserId) return new Response('Missing targetUserId', { status: 400 })

  // Check if conversation already exists
  let conversation = await prisma.conversation.findFirst({
    where: {
      isGroup: false,
      AND: [
        { participants: { some: { userId } } },
        { participants: { some: { userId: targetUserId } } }
      ]
    }
  })

  // Create if doesn't exist
  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        isGroup: false,
        participants: {
          create: [{ userId }, { userId: targetUserId }]
        }
      }
    })
  }

  return NextResponse.json(conversation)
}
