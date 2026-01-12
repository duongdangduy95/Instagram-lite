// app/api/blog/create/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redis } from '@/lib/redis'
import { MAX_MEDIA_FILES, MAX_IMAGE_BYTES, MAX_VIDEO_BYTES } from '@/lib/mediaValidation'

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
    const musicRaw = form.get('music')
    const files: File[] = []

    form.forEach((value, key) => {
      if (value instanceof File && (key === 'image' || key === 'images' || key === 'video' || key === 'videos')) {
        files.push(value)
      }
    })

    // 🎵 Parse optional music (stored as JSON string)
    let music: unknown = null
    if (typeof musicRaw === 'string' && musicRaw.trim()) {
      try {
        music = JSON.parse(musicRaw)
      } catch {
        return NextResponse.json({ error: 'Music payload is invalid' }, { status: 400 })
      }
    }

    // Validation: Cần có ít nhất caption hoặc files (giống client-side)
    if ((!caption || !caption.trim()) && files.length === 0) {
      return NextResponse.json(
        { error: 'Bài viết không được để trống. Vui lòng thêm nội dung hoặc hình ảnh.' },
        { status: 400 }
      )
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'Vui lòng thêm ít nhất một hình ảnh hoặc video.' },
        { status: 400 }
      )
    }

    // ✅ File validation (giống client-side để tránh bypass)
    if (files.length > MAX_MEDIA_FILES) {
      return NextResponse.json(
        { error: `Chỉ được tối đa ${MAX_MEDIA_FILES} file.` },
        { status: 400 }
      )
    }

    // Validate từng file
    for (const file of files) {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')

      if (!isImage && !isVideo) {
        return NextResponse.json(
          { error: `File "${file.name}" không phải ảnh/video hợp lệ.` },
          { status: 400 }
        )
      }

      const limit = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES
      if (file.size > limit) {
        const mb = (limit / (1024 * 1024)).toFixed(isVideo ? 0 : 1)
        return NextResponse.json(
          { error: `File "${file.name}" vượt quá dung lượng cho phép (${isVideo ? 'video' : 'ảnh'} ≤ ${mb}MB).` },
          { status: 400 }
        )
      }
    }

    // ✅ Rule: music only allowed for image-only posts (no video)
    const hasVideo = files.some((f) => (f.type || '').startsWith('video'))
    if (music && hasVideo) {
      return NextResponse.json(
        { error: 'Không thể thêm nhạc cho bài đăng có video. Tính năng nhạc chỉ áp dụng cho post toàn ảnh.' },
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
        ...(music ? { music: music as any } : {}),
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
    // Invalidate home feed cache (cả client và server-side)
    await redis.del('feed:initial')
    await redis.del('feed:initial:server')
    // Invalidate cursor-based cache patterns (nếu có)
    const keys = await redis.keys('feed:cursor:*')
    if (keys.length > 0) {
      await redis.del(...keys)
    }

    // ✅ Done
    return NextResponse.json({
      success: true,
      blog,
    })
  } catch (error) {
    console.error('Create blog error:', error)
    // Trả về error message chi tiết hơn nếu có thể
    const errorMessage = error instanceof Error ? error.message : 'Failed to create blog'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
