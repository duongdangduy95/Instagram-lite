import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redis } from '@/lib/redis'

function hashInt32(input: string) {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h | 0
}

const CONVERSATION_CACHE_KEY = (userId: string) =>
  `conversation:list:user:${userId}`

const CACHE_TTL = 3000 // seconds (chat realtime)

/* =========================
   GET – LIST CONVERSATIONS
========================= */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json([], { status: 401 })
  }

  const userId = session.user.id
  const cacheKey = CONVERSATION_CACHE_KEY(userId)

  /* ===== REDIS CACHE ===== */
  const cached = await redis.get(cacheKey)
  if (cached) {
    // Backward-compat: trước đây cache có thể là JSON string
    if (typeof cached === 'string') {
      try {
        return NextResponse.json(JSON.parse(cached))
      } catch {
        // fallback: trả thẳng (đỡ crash) và để TTL tự hết
        return NextResponse.json([])
      }
    }
    return NextResponse.json(cached)
  }

  /* ===== DATABASE QUERY ===== */
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: { some: { userId } }
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
    orderBy: { updatedAt: 'desc' }
  })

  const items = await Promise.all(
    conversations.map(async (c) => {
      const other = c.participants.find(p => p.userId !== userId)
      if (!other?.user) return null

      const unreadCount = await prisma.message.count({
        where: {
          conversationId: c.id,
          senderId: other.userId,
          status: { in: ['SENT', 'DELIVERED'] }
        }
      })

      const isFollowing = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: other.userId
          }
        }
      })

      const hasReplied = await prisma.message.findFirst({
        where: { conversationId: c.id, senderId: userId },
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
    })
  )

  const filtered = items.filter(Boolean)

  /* ===== MERGE BY OTHER USER (GIỮ NGUYÊN LOGIC CỦA BẠN) ===== */
  const byOtherUser = new Map<string, typeof filtered[number]>()
  for (const it of filtered) {
    const key = it!.otherUser.id
    const existing = byOtherUser.get(key)

    if (!existing) {
      byOtherUser.set(key, it!)
      continue
    }

    const a = it!.lastMessage?.createdAt
      ? new Date(it!.lastMessage.createdAt).getTime()
      : 0
    const b = existing.lastMessage?.createdAt
      ? new Date(existing.lastMessage.createdAt).getTime()
      : 0

    if (a > b) {
      byOtherUser.set(key, it!)
      continue
    }

    if (a === b) {
      const itScore =
        (it!.hasReplied ? 2 : 0) + (it!.unreadCount ? 1 : 0)
      const exScore =
        (existing.hasReplied ? 2 : 0) + (existing.unreadCount ? 1 : 0)

      if (itScore > exScore) {
        byOtherUser.set(key, it!)
      }
    }
  }

  const result = Array.from(byOtherUser.values())

  /* ===== SAVE CACHE ===== */
  // Upstash redis client tự serialize JSON, nên lưu object trực tiếp để get() trả ra đúng kiểu
  await redis.set(cacheKey, result, { ex: CACHE_TTL })

  return NextResponse.json(result)
}

/* =========================
   POST – CREATE CONVERSATION
========================= */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const { targetUserId } = await req.json()
  if (!targetUserId) {
    return new Response('Missing targetUserId', { status: 400 })
  }

  const [a, b] = [userId, targetUserId].sort()
  const lock1 = hashInt32(a)
  const lock2 = hashInt32(b)

  const findOrCreateConversation = async () =>
    prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        SELECT pg_advisory_xact_lock(${lock1}::int4, ${lock2}::int4)
      `

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
    })

  const conversation = await findOrCreateConversation()

  /* ===== CLEAR CACHE (CẢ 2 USER) ===== */
  await redis.del(CONVERSATION_CACHE_KEY(userId))
  await redis.del(CONVERSATION_CACHE_KEY(targetUserId))

  return NextResponse.json(conversation)
}
