// app/api/messages/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ---------------------- GET: Lấy tin nhắn ----------------------
export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id
  const url = new URL(req.url)
  const targetUserId = url.searchParams.get('userId')

  if (!currentUserId || !targetUserId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const conversation = await prisma.conversation.findFirst({
    where: {
      isGroup: false,
      participants: {
        some: { userId: { in: [currentUserId, targetUserId] } }
      }
    },
    include: { messages: true }
  })

  const messages = conversation?.messages || []

  return new Response(JSON.stringify(messages))
}
function sanitizeFileName(name: string) {
  return name
    .normalize('NFKD')                    // tách dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, '')      // bỏ dấu
    .replace(/[^a-zA-Z0-9._-]/g, '_');   // thay ký tự đặc biệt thành _
}

// ---------------------- POST: Gửi tin nhắn text + file ----------------------
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

  if (!targetUserId && !content && files.length === 0) {
    return new Response('Missing data', { status: 400 })
  }

  // Tìm hoặc tạo conversation
  let conversation = await prisma.conversation.findFirst({
    where: {
      isGroup: false,
      participants: { some: { userId: { in: [currentUserId, targetUserId as string] } } }
    }
  })

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        isGroup: false,
        participants: { create: [{ userId: currentUserId }, { userId: targetUserId as string }] }
      }
    })
  }

  // Upload file lên Supabase
  const fileUrls: string[] = []
  const fileNames: string[] = []
  for (const file of files) {
  const buffer = Buffer.from(await file.arrayBuffer())
  const ext = file.type.split('/')[1] || 'bin'

  const safeName = sanitizeFileName(file.name)         // tên safe để upload
  const fileName = `messages/${currentUserId}/${Date.now()}-${safeName}`

  const { data, error } = await supabase.storage
    .from('messages')
    .upload(fileName, buffer, { contentType: file.type, upsert: false })

  console.log('Supabase upload data:', data)
  console.log('Supabase upload error:', error)

  if (error) return new Response('File upload failed', { status: 500 })

  const { data: publicUrlData } = supabase
    .storage
    .from('messages')
    .getPublicUrl(fileName)

  if (publicUrlData?.publicUrl) {
    fileUrls.push(publicUrlData.publicUrl) // url dùng hiển thị
    fileNames.push(file.name)              // tên gốc để hiển thị trên chat
  }
}

  // Tạo message trong DB
  const message = await prisma.message.create({
  data: {
    conversationId: conversation.id,
    senderId: currentUserId,
    content: content || '',
    fileUrls: fileUrls,
    fileNames: fileNames
  }
})


  return NextResponse.json({ message })
}

// ---------------------- PATCH: Cập nhật tin nhắn ----------------------
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id
  if (!currentUserId) return new Response('Unauthorized', { status: 401 })

  const body = await req.json()
  const { messageId, newContent } = body
  if (!messageId || !newContent) return new Response('Missing data', { status: 400 })

  const message = await prisma.message.findUnique({ where: { id: messageId } })
  if (!message || message.senderId !== currentUserId) return new Response('Forbidden', { status: 403 })

  const updatedMessage = await prisma.message.update({
    where: { id: messageId },
    data: { content: newContent, updatedAt: new Date() }
  })

  return NextResponse.json({ message: updatedMessage })
}

// ---------------------- DELETE: Xóa tin nhắn ----------------------
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id
  if (!currentUserId) return new Response('Unauthorized', { status: 401 })

  const url = new URL(req.url)
  const messageId = url.searchParams.get('messageId')
  if (!messageId) return new Response('Missing messageId', { status: 400 })

  const message = await prisma.message.findUnique({ where: { id: messageId } })
  if (!message || message.senderId !== currentUserId) return new Response('Forbidden', { status: 403 })

  await prisma.message.delete({ where: { id: messageId } })

  return NextResponse.json({ success: true })
}
