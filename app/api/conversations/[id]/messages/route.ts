import { prisma } from '@/lib/prisma'
import { redis } from '@/lib/redis'
import { NextResponse } from 'next/server'

const CACHE_TTL = 3000 // 5 phút là hợp lý cho chat

const cacheKey = (conversationId: string) =>
  `conv:${conversationId}:messages`

/* =========================
   GET – LOAD MESSAGES
========================= */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = req.headers.get('x-user-id')
  const { id: conversationId } = await params

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ✅ Check participant
  const participant = await prisma.participant.findUnique({
    where: { userId_conversationId: { userId, conversationId } }
  })
  if (!participant) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const key = cacheKey(conversationId)

  try {
    /* ===== REDIS FIRST ===== */
    const cached = await redis.get(key)
    if (cached) {
      return NextResponse.json(JSON.parse(cached as string))
    }

    /* ===== DB FALLBACK ===== */
    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: { sender: true },
      orderBy: { createdAt: 'asc' }
    })

    /* ===== SAVE CACHE ===== */
    await redis.setex(key, CACHE_TTL, JSON.stringify(messages))

    return NextResponse.json(messages)
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

/* =========================
   POST – SEND MESSAGE
========================= */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: conversationId } = await params
  const { content, senderId } = await req.json()

  if (!content || !senderId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // ✅ Check participant
  const participant = await prisma.participant.findUnique({
    where: { userId_conversationId: { userId: senderId, conversationId } }
  })
  if (!participant) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    /* ===== CREATE MESSAGE ===== */
    const message = await prisma.message.create({
      data: { conversationId, senderId, content },
      include: { sender: true }
    })

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    })

    /* ===== 🔥 UPDATE REDIS (KHÔNG XÓA) ===== */
    const key = cacheKey(conversationId)
    const cached = await redis.get(key)

    if (cached) {
      const list = JSON.parse(cached as string)
      list.push(message)

      await redis.setex(key, CACHE_TTL, JSON.stringify(list))
    }

    return NextResponse.json(message)
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
