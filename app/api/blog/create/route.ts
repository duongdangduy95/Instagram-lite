// app/api/blog/create/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    // Lấy session từ NextAuth
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id

    // Lấy dữ liệu FormData
    const form = await req.formData()
    const caption = form.get('caption') as string
    const files: File[] = []

    form.forEach((value, key) => {
      if (value instanceof File && (key === 'image' || key === 'images')) {
        files.push(value)
      }
    })

    if (!caption || files.length === 0) {
      return NextResponse.json(
        { error: 'Caption and at least one image are required' },
        { status: 400 }
      )
    }

    const uploadedUrls: string[] = []

    // Upload từng ảnh lên Supabase
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const fileName = `posts/${encodeURIComponent(userId)}/${Date.now()}-${file.name}`

      const { error } = await supabase.storage
        .from('instagram')
        .upload(fileName, buffer, { contentType: file.type })

      if (error) {
        console.error('Supabase upload error:', error)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
      }

      const { data } = supabase.storage.from('instagram').getPublicUrl(fileName)
      uploadedUrls.push(data.publicUrl)
    }

    // Tạo blog trong DB
    const blog = await prisma.blog.create({
      data: {
        caption,
        imageUrls: uploadedUrls,
        authorId: userId,
      },
    })

    return NextResponse.json({ message: 'Blog created', blog })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 })
  }
}
