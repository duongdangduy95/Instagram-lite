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

const redis = new Redis({
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

// File limits for messages (more lenient than blog posts)
const MAX_MESSAGE_FILES = 10
const MAX_MESSAGE_FILE_SIZE = 25 * 1024 * 1024 // 25MB per file (for messages, allow larger files)

const messagesKey = (conversationId: string) =>
  `conversation:${conversationId}:messages`

const conversationListKey = (userId: string) =>
  `conversation:list:user:${userId}`

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
    // Dù cache hit, vẫn cần update SENT -> DELIVERED (người nhận đã mở chat)
    // và refresh cache để UI nhận status mới ngay.
    try {
      await prisma.message.updateMany({
        where: {
          conversationId: conversation.id,
          senderId: { not: currentUserId },
          status: 'SENT'
        },
        data: { status: 'DELIVERED' }
      })
    } catch {
      // ignore
    }

    const cachedArray = Array.isArray(cachedMessages) ? (cachedMessages as any[]) : null
    const nextMessages = cachedArray
      ? cachedArray.map(m =>
          m?.senderId !== currentUserId && m?.status === 'SENT'
            ? { ...m, status: 'DELIVERED' }
            : m
        )
      : cachedMessages

    // best-effort: đồng bộ cache với status mới
    try {
      await redis.set(redisKey, nextMessages, { ex: 3000 })
    } catch {
      // ignore
    }

    return NextResponse.json({
      conversationId: conversation.id,
      messages: nextMessages
    })
  }

  // ❌ MISS → QUERY DB
  const messages = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: 'asc' }
  })

  // Update DELIVERED
  await prisma.message.updateMany({
    where: {
      conversationId: conversation.id,
      senderId: { not: currentUserId },
      status: 'SENT'
    },
    data: { status: 'DELIVERED' }
  })

  // Trả về messages đã DELIVERED luôn để UI cập nhật ngay
  const nextMessages = messages.map(m =>
    m.senderId !== currentUserId && m.status === 'SENT'
      ? { ...m, status: 'DELIVERED' as const }
      : m
  )

  // Cache 3000s
  await redis.set(redisKey, nextMessages, { ex: 3000 })

  return NextResponse.json({
    conversationId: conversation.id,
    messages: nextMessages
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

  // 📁 Lấy files từ formData (có thể có nhiều files với cùng key 'files')
  const files: File[] = []
  const filesFromForm = form.getAll('files')
  for (const file of filesFromForm) {
    if (file instanceof File) {
      files.push(file)
    }
  }

  // ✅ Validation: Message phải có ít nhất content hoặc files
  const contentTrimmed = content.trim()
  if (!contentTrimmed && files.length === 0) {
    return NextResponse.json(
      { error: 'Tin nhắn không được để trống. Vui lòng nhập nội dung hoặc đính kèm file.' },
      { status: 400 }
    )
  }

  // ✅ File validation: số lượng và size
  if (files.length > MAX_MESSAGE_FILES) {
    return NextResponse.json(
      { error: `Chỉ được gửi tối đa ${MAX_MESSAGE_FILES} file.` },
      { status: 400 }
    )
  }

  // Validate từng file trước khi upload
  const fileErrors: string[] = []
  for (const file of files) {
    if (file.size > MAX_MESSAGE_FILE_SIZE) {
      const mb = (MAX_MESSAGE_FILE_SIZE / (1024 * 1024)).toFixed(0)
      fileErrors.push(`File "${file.name}" vượt quá dung lượng cho phép (≤ ${mb}MB).`)
    }
  }

  if (fileErrors.length > 0) {
    return NextResponse.json(
      { error: fileErrors.join(' ') },
      { status: 400 }
    )
  }

  // ☁️ Upload files lên Supabase nếu có
  const fileUrls: string[] = []
  const fileNames: string[] = []
  const uploadErrors: string[] = []

  if (files.length > 0) {
    for (const file of files) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer())
        const ext = file.type?.split('/')[1] || file.name.split('.').pop() || 'bin'
        const safeName = sanitizeFileName(file.name)
        const fileName = `messages/${currentUserId}/${Date.now()}-${Math.random()}.${ext}`

        const { error } = await supabase.storage
          .from('instagram')
          .upload(fileName, buffer, {
            contentType: file.type || 'application/octet-stream',
          })

        if (error) {
          console.error('File upload error:', error)
          uploadErrors.push(`Không thể upload file "${file.name}".`)
          // Tiếp tục với các file khác, không fail toàn bộ
          continue
        }

        const { data } = supabase.storage
          .from('instagram')
          .getPublicUrl(fileName)

        fileUrls.push(data.publicUrl)
        fileNames.push(safeName)
      } catch (error) {
        console.error('Error processing file:', error)
        uploadErrors.push(`Lỗi khi xử lý file "${file.name}".`)
        // Tiếp tục với các file khác
      }
    }

    // Nếu có files nhưng tất cả đều upload fail, và không có content → reject
    if (fileUrls.length === 0 && !contentTrimmed) {
      return NextResponse.json(
        { error: uploadErrors.length > 0 
          ? `Không thể upload file. ${uploadErrors.join(' ')}` 
          : 'Không thể upload file. Vui lòng thử lại.' },
        { status: 400 }
      )
    }
  }

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

  // ✅ Đảm bảo message có ít nhất content hoặc fileUrls
  if (!contentTrimmed && fileUrls.length === 0) {
    return NextResponse.json(
      { error: 'Tin nhắn không được để trống. Vui lòng nhập nội dung hoặc đính kèm file.' },
      { status: 400 }
    )
  }

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: currentUserId,
      content: contentTrimmed, // Lưu trimmed content
      fileUrls,
      fileNames,
      status: 'SENT'
    }
  })

  // Nếu có upload errors nhưng vẫn tạo được message (một số files thành công), 
  // có thể log warning nhưng không fail request
  if (uploadErrors.length > 0 && fileUrls.length > 0) {
    console.warn('Some files failed to upload:', uploadErrors)
  }

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { updatedAt: new Date() }
  })

  // ✅ INVALIDATE REDIS
  // - messages cache của conversation
  // - conversation list cache của cả 2 phía để hasReplied/unreadCount/isPending không bị stale khi F5
  await redis.del(messagesKey(conversation.id))
  await redis.del(conversationListKey(currentUserId))
  await redis.del(conversationListKey(targetUserId))

  // NOTE: không tạo notification cho tin nhắn (đã bỏ thông báo tin nhắn ở nút Thông báo)

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

  // "Seen" theo UI hiện tại: mở chat là xem => mark SEEN cho mọi message của đối phương chưa SEEN
  const seenCount = await prisma.message.count({
    where: {
      conversationId,
      senderId: { not: userId },
      status: { in: ['SENT', 'DELIVERED'] }
    }
  })

  if (seenCount === 0) {
    return NextResponse.json({ seenCount: 0 })
  }

  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: userId },
      status: { in: ['SENT', 'DELIVERED'] }
    },
    data: { status: 'SEEN' }
  })

  await redis.del(messagesKey(conversationId))
  // unreadCount trong conversation list phụ thuộc status -> cần clear cache list của user đang xem
  await redis.del(conversationListKey(userId))
  return NextResponse.json({ seenCount })
}
