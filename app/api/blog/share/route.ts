import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  console.log('📥 SHARE API CALLED')

  const session = await getServerSession(authOptions)
  console.log('🔐 session:', session)

  if (!session?.user?.id) {
    console.log('❌ No session')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  console.log('👤 userId:', userId)

  const body = await req.json()
  console.log('📦 request body:', body)

  const { blogId, caption } = body

  if (!blogId) {
    console.log('❌ Missing blogId')
    return NextResponse.json({ error: 'Missing blogId' }, { status: 400 })
  }

  // 🔍 LẤY BÀI GỐC
  const originalBlog = await prisma.blog.findUnique({
    where: { id: blogId },
    include: {
      author: {
        select: {
          id: true,
          fullname: true,
        },
      },
    },
  })

  console.log('📄 originalBlog:', originalBlog)

  if (!originalBlog) {
    console.log('❌ Blog not found')
    return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
  }

  // 🆕 TẠO BÀI SHARE
  const sharedBlog = await prisma.blog.create({
    data: {
      caption: caption || '',
      imageUrl: originalBlog.imageUrl, // Lưu ảnh của bài gốc
      authorId: userId,
      sharedFromId: originalBlog.id,
    },
  })

  console.log('✅ sharedBlog CREATED:', sharedBlog)

  return NextResponse.json({
    success: true,
    sharedBlog,
    originalBlog,
  })
}
