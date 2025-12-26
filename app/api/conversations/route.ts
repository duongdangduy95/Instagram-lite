// app/api/conversations/route.ts
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'



export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const userId = session.user.id

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: { userId } // chỉ lấy conversation có user tham gia
      }
    },
    include: {
      participants: {
        select: { userId: true, conversationId: true }
      },
      messages: {
        orderBy: { createdAt: 'asc' },
        take: 20
      }
    },
    orderBy: { updatedAt: 'desc' }
  })

  return new Response(JSON.stringify(conversations))
}


export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id
  if (!currentUserId) return new Response('Unauthorized', { status: 401 })

  const body = await req.json()
  const { name, participantIds } = body

  if (!participantIds || participantIds.length === 0) return new Response('Bad Request', { status: 400 })

  const conversation = await prisma.conversation.create({
    data: {
      name,
      isGroup: true,
      participants: {
        create: [
          { userId: currentUserId }, // creator
          ...participantIds.map((id: string) => ({ userId: id })),
        ],
      },
    },
    include: { participants: { include: { user: true } } },
  })

  return new Response(JSON.stringify(conversation))
}
