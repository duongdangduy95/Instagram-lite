import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

// Dọn dẹp tên file
function sanitizeFileName(name: string) {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
}

// ==============================
// GET LIST CONVERSATIONS
// ==============================
export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id
  if (!currentUserId) return new Response('Unauthorized', { status: 401 })

  const url = new URL(req.url)
  const targetUserId = url.searchParams.get('userId')

  if (!targetUserId) {
    // Lấy list conversation
    const conversations = await prisma.conversation.findMany({
      where: { participants: { some: { userId: currentUserId } } },
      include: {
        participants: { include: { user: { select: { id: true, username: true, fullname: true, image: true } } } },
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

  // Lấy conversation với 1 người cụ thể
  const conversation = await prisma.conversation.findFirst({
    where: {
      isGroup: false,
      AND: [
        { participants: { some: { userId: currentUserId } } },
        { participants: { some: { userId: targetUserId } } }
      ]
    },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
    orderBy: { updatedAt: 'desc' }
  })

  // Cập nhật trạng thái Delivered
  if (conversation) {
    await prisma.message.updateMany({
      where: {
        conversationId: conversation.id,
        senderId: { not: currentUserId },
        status: 'SENT'
      },
      data: { status: 'DELIVERED' }
    })
  }

  return NextResponse.json({
    conversationId: conversation?.id || null,
    messages: conversation?.messages || []
  })
}

// ==============================
// POST MESSAGE (text + file) + notification
// ==============================
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

  // Serialize create/find to avoid duplicate direct conversations
  const [a, b] = [currentUserId, targetUserId].sort()
  const lock1 = hashInt32(a)
  const lock2 = hashInt32(b)

  const conversation = await prisma.$transaction(async (tx) => {
    // Prisma bind number -> bigint; cast về int4 để match overload (int4,int4)
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(${lock1}::int4, ${lock2}::int4)`

    // Kiểm tra conversation đã tồn tại chưa
    let conv = await tx.conversation.findFirst({
      where: {
        isGroup: false,
        AND: [
          { participants: { some: { userId: currentUserId } } },
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
            create: [{ userId: currentUserId }, { userId: targetUserId }]
          }
        }
      })
    }

    return conv
  })

  const fileUrls: string[] = []
  const fileNames: string[] = []

  for (const file of files) {
    // Server-side guard (để tránh tình huống bucket limit/req quá lớn gây lỗi khó hiểu)
    const maxImageBytes = 10 * 1024 * 1024 // 10MB
    const maxVideoBytes = 50 * 1024 * 1024 // 50MB
    const isVideo = file.type?.startsWith('video/')
    const limit = isVideo ? maxVideoBytes : maxImageBytes
    if (file.size > limit) {
      return NextResponse.json(
        { error: `"${file.name}" vượt quá dung lượng cho phép.` },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const safeName = sanitizeFileName(file.name)
    const fileName = `messages/${currentUserId}/${Date.now()}-${safeName}`

    const { error } = await supabase.storage
      .from('messages')
      .upload(fileName, buffer, {
        contentType: file.type || 'application/octet-stream',
        cacheControl: '3600',
        // Tránh trường hợp tên file trùng ms (double click/2 files cùng tên) gây fail "resource already exists"
        upsert: true
      })

    if (error) {
      return NextResponse.json(
        { error: `Upload ảnh/file thất bại: ${error.message}` },
        { status: 400 }
      )
    }

    const { data } = supabase.storage.from('messages').getPublicUrl(fileName)
    if (!data?.publicUrl) {
      return NextResponse.json(
        { error: 'Không lấy được public URL cho file đã upload.' },
        { status: 500 }
      )
    }

    fileUrls.push(data.publicUrl)
    fileNames.push(file.name)
  }

  // Tạo message
  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: currentUserId,
      content,
      fileUrls,
      fileNames,
      status: 'SENT'
    }
  })

  // Bump conversation updatedAt để canonical ordering ổn định
  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { updatedAt: new Date() }
  })

  // 🔔 Tạo notification MESSAGE cho người nhận
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

// ==============================
// PATCH - UPDATE MESSAGE
// ==============================
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const { messageId, content } = await req.json()

  const msg = await prisma.message.findUnique({ where: { id: messageId } })
  if (!msg || msg.senderId !== userId)
    return new Response('Forbidden', { status: 403 })

  if (msg.fileUrls.length > 0)
    return new Response('Cannot edit file message', { status: 400 })

  const updated = await prisma.message.update({
    where: { id: messageId },
    data: { content }
  })

  return NextResponse.json(updated)
}

// ==============================
// DELETE - DELETE MESSAGE
// ==============================
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const { messageId } = await req.json()
  const msg = await prisma.message.findUnique({ where: { id: messageId } })

  if (!msg || msg.senderId !== userId)
    return new Response('Forbidden', { status: 403 })

  await prisma.message.delete({ where: { id: messageId } })
  return new Response(null, { status: 204 })
}

// ==============================
// PUT - MARK AS SEEN (CORRECT)
// ==============================
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const { conversationId } = await req.json()
  if (!conversationId)
    return new Response('Missing conversationId', { status: 400 })

  // 1️⃣ ĐẾM CHỈ những tin CHƯA SEEN
  const seenCount = await prisma.message.count({
    where: {
      conversationId,
      senderId: { not: userId },
      status: 'DELIVERED'
    }
  })

  // Không có gì mới → không làm gì cả
  if (seenCount === 0) {
    return NextResponse.json({ seenCount: 0 })
  }

  // 2️⃣ UPDATE CHỈ những tin này
  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: userId },
      status: 'DELIVERED'
    },
    data: { status: 'SEEN' }
  })

  // 3️⃣ TRẢ VỀ SỐ TIN VỪA SEEN
  return NextResponse.json({ seenCount })
}
