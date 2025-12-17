import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  const form = await req.formData()
  const caption = form.get('caption') as string
  const hashtagsStr = form.get('hashtags') as string
  const hashtags = hashtagsStr ? JSON.parse(hashtagsStr) : []

  const files: File[] = []
  form.forEach((value, key) => {
    if (value instanceof File && (key === 'images' || key === 'videos')) {
      files.push(value)
    }
  })

  if (!caption || files.length === 0) {
    return NextResponse.json(
      { error: 'Caption and at least one image are required' },
      { status: 400 }
    )
  }

  const imageUrls: string[] = []

  // Lưu từng ảnh vào public/uploads
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const filename = `${Date.now()}-${file.name}`
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename)

    fs.writeFileSync(filepath, buffer)
    imageUrls.push(`/uploads/${filename}`)
  }

  try {
    const blog = await prisma.blog.create({
      data: {
        caption,
        imageUrls, // lưu mảng URL
        hashtags,
        authorId: userId,
      },
    })

    return NextResponse.json({ message: 'Blog created', blog })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 })
  }
}
