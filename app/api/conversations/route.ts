import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function hashInt32(input: string) {
  // FNV-1a 32-bit
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  // signed int32
  return h | 0
}

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

  const items = await Promise.all(conversations.map(async c => {
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

  const filtered = items.filter(Boolean) as Array<{
    id: string
    otherUser: { id: string; username: string; fullname: string; image: string | null }
    lastMessage: { content: string; createdAt: Date; senderId: string } | null
    unreadCount: number
    isFollowing: boolean
    hasReplied: boolean
  }>

  // ✅ Dedupe ở server: nếu DB lỡ có nhiều conversation cho cùng 1 otherUser,
  // chỉ trả về conversation "mới nhất" (theo lastMessage.createdAt, fallback unreadCount/hasReplied).
  const byOtherUser = new Map<string, typeof filtered[number]>()
  for (const it of filtered) {
    const key = it.otherUser.id
    const existing = byOtherUser.get(key)

    if (!existing) {
      byOtherUser.set(key, it)
      continue
    }

    const a = it.lastMessage?.createdAt ? new Date(it.lastMessage.createdAt).getTime() : 0
    const b = existing.lastMessage?.createdAt ? new Date(existing.lastMessage.createdAt).getTime() : 0

    if (a > b) {
      byOtherUser.set(key, it)
      continue
    }

    // Nếu không có lastMessage để so (hoặc bằng nhau), ưu tiên item có hasReplied=true hoặc unreadCount lớn hơn
    if (a === b) {
      const itScore = (it.hasReplied ? 2 : 0) + (it.unreadCount ? 1 : 0)
      const exScore = (existing.hasReplied ? 2 : 0) + (existing.unreadCount ? 1 : 0)
      if (itScore > exScore) {
        byOtherUser.set(key, it)
      }
    }
  }

  return NextResponse.json(Array.from(byOtherUser.values()))
}

// POST - Create new conversation
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const { targetUserId } = await req.json()
  if (!targetUserId) return new Response('Missing targetUserId', { status: 400 })

  // Serialize create/find to avoid duplicate direct conversations
  const [a, b] = [userId, targetUserId].sort()
  const lock1 = hashInt32(a)
  const lock2 = hashInt32(b)

  const findOrCreateConversation = async () =>
    prisma.$transaction(
      async (tx) => {
        // pg_advisory_xact_lock overload: (int4,int4) hoặc (bigint).
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(${lock1}::int4, ${lock2}::int4)`

        // Check if conversation already exists
        let conv = await tx.conversation.findFirst({
          where: {
            isGroup: false,
            AND: [
              { participants: { some: { userId } } },
              { participants: { some: { userId: targetUserId } } }
            ]
          },
          orderBy: { updatedAt: 'desc' }
        })

        // Create if doesn't exist
        if (!conv) {
          conv = await tx.conversation.create({
            data: {
              isGroup: false,
              participants: {
                create: [{ userId }, { userId: targetUserId }]
              }
            }
          })
        }

        return conv
      },
      { maxWait: 10_000, timeout: 20_000 }
    )

  let conversation: any
  try {
    conversation = await findOrCreateConversation()
  } catch (e: unknown) {
    const code = (e as { code?: string } | null)?.code
    if (code === 'P2028') {
      await new Promise((r) => setTimeout(r, 250))
      conversation = await findOrCreateConversation()
    } else {
      throw e
    }
  }

  return NextResponse.json(conversation)
}
