// app/api/blog/create/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redis } from '@/lib/redis'

const prisma = new PrismaClient()

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const HASHTAG_REGEX = /#[\p{L}\p{N}_]+/gu

export async function POST(req: Request) {
  try {
    // 🔐 Check session
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // 📦 Lấy form data
    const form = await req.formData()
    const caption = form.get('caption') as string
    const files: File[] = []

    form.forEach((value, key) => {
      if (value instanceof File && (key === 'image' || key === 'images' || key === 'video' || key === 'videos')) {
        files.push(value)
      }
    })

    if (!caption || files.length === 0) {
      return NextResponse.json(
        { error: 'Caption and at least one image are required' },
        { status: 400 }
      )
    }

    // #️⃣ Extract hashtag
    const hashtags = Array.from(
      new Set(
        (caption.match(HASHTAG_REGEX) || []).map((h) =>
          h.slice(1).toLowerCase()
        )
      )
    )

    // ☁️ Upload ảnh lên Supabase
    const imageUrls: string[] = []

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const ext = file.type.split('/')[1] || 'jpg'
      const fileName = `posts/${userId}/${Date.now()}-${Math.random()}.${ext}`

      const { error } = await supabase.storage
        .from('instagram')
        .upload(fileName, buffer, {
          contentType: file.type,
        })

      if (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
      }

      const { data } = supabase.storage
        .from('instagram')
        .getPublicUrl(fileName)

      imageUrls.push(data.publicUrl)
    }

    // 🆕 Tạo blog
    const blog = await prisma.blog.create({
      data: {
        caption,
        imageUrls,
        authorId: userId,
      },
    })

    // 🔗 Hashtag
    for (const tag of hashtags) {
      const hashtag = await prisma.hashtag.upsert({
        where: { name: tag },
        update: {
          usage_count: { increment: 1 },
        },
        create: {
          name: tag,
          usage_count: 1,
        },
      })

      await prisma.blogHashtag.create({
        data: {
          blog_id: blog.id,
          hashtag_id: hashtag.id,
        },
      })
    }

    // 🔔 ===== TẠO NOTIFICATION CHO FOLLOWERS =====
    const followers = await prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      select: {
        followerId: true,
      },
    })

    if (followers.length > 0) {
      await prisma.notification.createMany({
        data: followers.map((f) => ({
          userId: f.followerId, // người nhận
          actorId: userId,       // người đăng bài
          type: 'NEW_POST',
          blogId: blog.id,
        })),
      })
    }

    // 🧹 Invalidate Cache
    await redis.del(`me:${userId}`)

    // ✅ Done
    return NextResponse.json({
      success: true,
      blog,
    })
  } catch (error) {
    console.error('Create blog error:', error)
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    )
  }
}
