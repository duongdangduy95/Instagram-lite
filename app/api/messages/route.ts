import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id
  const { searchParams } = new URL(req.url)
  const targetUserId = searchParams.get('userId')

  if (!currentUserId || !targetUserId) return new Response('Unauthorized', { status: 401 })

  // Tìm cuộc hội thoại 1-1
  const conversation = await prisma.conversation.findFirst({
    where: {
      isGroup: false,
      AND: [
        { participants: { some: { userId: currentUserId } } },
        { participants: { some: { userId: targetUserId } } }
      ]
    },
    // QUAN TRỌNG NHẤT: Phải include messages thì log Prisma mới có lệnh SELECT Message
    include: { 
      messages: {
        orderBy: { createdAt: 'asc' } 
      } 
    }
  })

  return NextResponse.json({
    conversationId: conversation?.id || null,
    messages: conversation?.messages || [] // Nếu tìm thấy conv, messages sẽ ở đây
  })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id
  if (!currentUserId) return new Response('Unauthorized', { status: 401 })

  const form = await req.formData()
  const targetUserId = form.get('targetUserId')?.toString()
  const content = form.get('content')?.toString() || ''
  
  // Xử lý files (nếu có)... (giữ nguyên logic upload của bạn)

  // Đảm bảo có Conversation trước khi tạo Message
  let conversation = await prisma.conversation.findFirst({
    where: {
      isGroup: false,
      AND: [
        { participants: { some: { userId: currentUserId } } },
        { participants: { some: { userId: targetUserId } } }
      ]
    }
  })

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        isGroup: false,
        participants: { create: [{ userId: currentUserId }, { userId: targetUserId! }] }
      }
    })
  }

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: currentUserId,
      content,
      fileUrls: [], // Thêm logic url file của bạn vào đây
      fileNames: []
    }
  })

  return NextResponse.json({ message })
}