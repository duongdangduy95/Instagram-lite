// C:\Users\DUONG DUY\Documents\Visual Studio 2017\insta-clone\app\api\blog\create\route.ts

import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
<<<<<<< HEAD
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authConfig'
=======
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (session.user as any).id

  if (!userId) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  // Lấy dữ liệu từ FormData
  const form = await req.formData()
  const caption = form.get('caption') as string
  const file = form.get('image') as File

  if (!caption || !file) {
    return NextResponse.json({ error: 'Caption and image are required' }, { status: 400 })
  }

  // Đọc dữ liệu ảnh và lưu tạm (hoặc upload lên Cloudinary, v.v.)
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const filename = `${Date.now()}-${file.name}`
  const fs = await import('fs')
  const path = await import('path')
  const filepath = path.join(process.cwd(), 'public', 'uploads', filename)

  fs.writeFileSync(filepath, buffer)

  const imageUrl = `/uploads/${filename}`

  // Lưu bài viết vào DB
  try {
    const blog = await prisma.blog.create({
      data: {
        caption,
        imageUrl,
        authorId: userId,
      },
    })

    return NextResponse.json({ message: 'Blog created', blog })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 })
  }
}
