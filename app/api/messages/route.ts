// app/api/messages/route.ts
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id
  const url = new URL(req.url)
  const targetUserId = url.searchParams.get('userId')

  if (!currentUserId || !targetUserId) return new Response('Unauthorized', { status: 401 })

  // Tìm conversation 1-1 giữa currentUser và targetUser
  const conversation = await prisma.conversation.findFirst({
    where: {
      isGroup: false,
      participants: {
        every: { userId: { in: [currentUserId, targetUserId] } },
      },
    },
    include: { messages: true },
  })

  const messages = conversation?.messages || []

  return new Response(JSON.stringify(messages))
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id
  const body = await req.json()
  const { targetUserId, content } = body

  if (!currentUserId || !targetUserId || !content) return new Response('Bad Request', { status: 400 })

  // Tìm hoặc tạo conversation 1-1
  let conversation = await prisma.conversation.findFirst({
    where: {
      isGroup: false,
      participants: {
        every: { userId: { in: [currentUserId, targetUserId] } },
      },
    },
  })

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        isGroup: false,
        participants: {
          create: [
            { userId: currentUserId },
            { userId: targetUserId },
          ],
        },
      },
    })
  }

  // Tạo message
  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: currentUserId,
      content,
    },
  })

  return new Response(JSON.stringify(message))
}
