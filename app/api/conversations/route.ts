import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id

  if (!currentUserId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await req.json()
  const { targetUserId } = body

  if (!targetUserId) {
    return new Response('Missing targetUserId', { status: 400 })
  }

  // Tìm hoặc tạo conversation 1-1
  let conversation = await prisma.conversation.findFirst({
    where: {
      isGroup: false,
      participants: {
        some: { userId: { in: [currentUserId, targetUserId] } }
      }
    }
  })

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        isGroup: false,
        participants: {
          create: [{ userId: currentUserId }, { userId: targetUserId }]
        }
      }
    })
  }

  return new Response(JSON.stringify(conversation))
}
