import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Hàm dọn dẹp tên file của bạn
function sanitizeFileName(name: string) {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_');
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id
  const url = new URL(req.url)
  const targetUserId = url.searchParams.get('userId')

  if (!currentUserId || !targetUserId) return new Response('Unauthorized', { status: 401 })

  // Tìm cuộc hội thoại và include tin nhắn
  const conversation = await prisma.conversation.findFirst({
    where: {
      isGroup: false,
      AND: [
        { participants: { some: { userId: currentUserId } } },
        { participants: { some: { userId: targetUserId } } }
      ]
    },
    include: { messages: { orderBy: { createdAt: 'asc' } } }
  })

  // Trả về Object chứa ID hội thoại và mảng tin nhắn
  return NextResponse.json({
    conversationId: conversation?.id || null,
    messages: conversation?.messages || []
  })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id
  if (!currentUserId) return new Response('Unauthorized', { status: 401 })

  const form = await req.formData()
  const targetUserId = form.get('targetUserId')?.toString()
  const content = form.get('content')?.toString() || ''
  const files: File[] = []

  form.forEach((value, key) => {
    if (value instanceof File && (key === 'file' || key === 'files')) {
      files.push(value)
    }
  })

  if (!targetUserId) return new Response('Missing targetUserId', { status: 400 })

  // Tìm hoặc tạo conversation
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
        participants: { create: [{ userId: currentUserId }, { userId: targetUserId }] }
      }
    })
  }

  // Upload file lên Supabase (Logic của bạn)
  const fileUrls: string[] = []
  const fileNames: string[] = []

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const safeName = sanitizeFileName(file.name)
    const fileName = `messages/${currentUserId}/${Date.now()}-${safeName}`

    const { error } = await supabase.storage
      .from('messages')
      .upload(fileName, buffer, { contentType: file.type })

    if (!error) {
      const { data: publicUrlData } = supabase.storage.from('messages').getPublicUrl(fileName)
      if (publicUrlData?.publicUrl) {
        fileUrls.push(publicUrlData.publicUrl)
        fileNames.push(file.name) // Lưu tên gốc
      }
    }
  }

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: currentUserId,
      content,
      fileUrls,
      fileNames
    }
  })

  return NextResponse.json({ message })
}