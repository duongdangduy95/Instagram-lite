import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'
import { Redis } from '@upstash/redis'

/* ==============================
   INIT CLIENTS
============================== */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

/* ==============================
   HELPERS
============================== */
function hashInt32(input: string) {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h | 0
}

function sanitizeFileName(name: string) {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
}

const messagesKey = (conversationId: string) =>
  `conversation:${conversationId}:messages`

/* ==============================
   GET
============================== */
export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id
  if (!currentUserId) return new Response('Unauthorized', { status: 401 })

  const url = new URL(req.url)
  const targetUserId = url.searchParams.get('userId')

  /* ===== LIST CONVERSATIONS ===== */
  if (!targetUserId) {
    const conversations = await prisma.conversation.findMany({
      where: { participants: { some: { userId: currentUserId } } },
      include: {
        participants: {
          include: {
            user: { select: { id: true, username: true, fullname: true, image: true } }
          }
        },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 }
      },
      orderBy: { updatedAt: 'desc' }
    })

    const result = conversations
      .map(c => {
        const other = c.participants.find(p => p.userId !== currentUserId)
        if (!other?.user) return null
        return {
          id: c.id,
          otherUser: other.user,
          lastMessage: c.messages[0]
            ? { content: c.messages[0].content, createdAt: c.messages[0].createdAt }
            : null
        }
      })
      .filter(Boolean)

    return NextResponse.json(result)
  }

  /* ===== GET CONVERSATION + MESSAGES ===== */
  const conversation = await prisma.conversation.findFirst({
    where: {
      isGroup: false,
      AND: [
        { participants: { some: { userId: currentUserId } } },
        { participants: { some: { userId: targetUserId } } }
      ]
    }
  })

  if (!conversation) {
    return NextResponse.json({ conversationId: null, messages: [] })
  }

  const redisKey = messagesKey(conversation.id)

  // 🔥 TRY REDIS FIRST
  const cachedMessages = await redis.get(redisKey)
  if (cachedMessages) {
    return NextResponse.json({
      conversationId: conversation.id,
      messages: cachedMessages
    })
  }

  // ❌ MISS → QUERY DB
  const messages = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: 'asc' }
  })

  // Cache 60s
  await redis.set(redisKey, messages, { ex: 3000 })

  // Update DELIVERED
  await prisma.message.updateMany({
    where: {
      conversationId: conversation.id,
      senderId: { not: currentUserId },
      status: 'SENT'
    },
    data: { status: 'DELIVERED' }
  })

  return NextResponse.json({
    conversationId: conversation.id,
    messages
  })
}

/* ==============================
   POST
============================== */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id
  if (!currentUserId) return new Response('Unauthorized', { status: 401 })

  const form = await req.formData()
  const targetUserId = form.get('targetUserId')?.toString()
  const content = form.get('content')?.toString() || ''
  if (!targetUserId) return new Response('Missing targetUserId', { status: 400 })

  const [a, b] = [currentUserId, targetUserId].sort()
  const lock1 = hashInt32(a)
  const lock2 = hashInt32(b)

  const conversation = await prisma.$transaction(async tx => {
    await tx.$executeRaw`
      SELECT pg_advisory_xact_lock(${lock1}::int4, ${lock2}::int4)
    `

    let conv = await tx.conversation.findFirst({
      where: {
        isGroup: false,
        AND: [
          { participants: { some: { userId: currentUserId } } },
          { participants: { some: { userId: targetUserId } } }
        ]
      }
    })

    if (!conv) {
      conv = await tx.conversation.create({
        data: {
          isGroup: false,
          participants: {
            create: [{ userId: currentUserId }, { userId: targetUserId }]
          }
        }
      })
    }
    return conv
  })

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: currentUserId,
      content,
      status: 'SENT'
    }
  })

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { updatedAt: new Date() }
  })

  // ❌ INVALIDATE REDIS
  await redis.del(messagesKey(conversation.id))

  await prisma.notification.create({
    data: {
      userId: targetUserId,
      actorId: currentUserId,
      type: 'MESSAGE',
      conversationId: conversation.id,
      messageId: message.id
    }
  })

  return NextResponse.json({ message })
}

/* ==============================
   PATCH
============================== */
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const { messageId, content } = await req.json()
  const msg = await prisma.message.findUnique({ where: { id: messageId } })
  if (!msg || msg.senderId !== userId)
    return new Response('Forbidden', { status: 403 })

  const updated = await prisma.message.update({
    where: { id: messageId },
    data: { content }
  })

  await redis.del(messagesKey(msg.conversationId))
  return NextResponse.json(updated)
}

/* ==============================
   DELETE
============================== */
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const { messageId } = await req.json()
  const msg = await prisma.message.findUnique({ where: { id: messageId } })
  if (!msg || msg.senderId !== userId)
    return new Response('Forbidden', { status: 403 })

  await prisma.message.delete({ where: { id: messageId } })
  await redis.del(messagesKey(msg.conversationId))

  return new Response(null, { status: 204 })
}

/* ==============================
   PUT - SEEN
============================== */
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const { conversationId } = await req.json()
  if (!conversationId)
    return new Response('Missing conversationId', { status: 400 })

  const seenCount = await prisma.message.count({
    where: {
      conversationId,
      senderId: { not: userId },
      status: 'DELIVERED'
    }
  })

  if (seenCount === 0) {
    return NextResponse.json({ seenCount: 0 })
  }

  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: userId },
      status: 'DELIVERED'
    },
    data: { status: 'SEEN' }
  })

  await redis.del(messagesKey(conversationId))
  return NextResponse.json({ seenCount })
}
