import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'
import { Prisma } from '@prisma/client'
import { redis } from '@/lib/redis'

/* =========================
   UTILS
========================= */
function extractHashtags(text: string): string[] {
  return Array.from(
    new Set(
      [...text.matchAll(/#([\p{L}\p{N}_]+)/gu)].map(m =>
        m[1].toLowerCase()
      )
    )
  )
}

function sanitizeFileName(filename: string) {
  return filename
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
}

const BLOG_CACHE_KEY = (blogId: string) => `blog:detail:${blogId}`

/* =========================
   SUPABASE
========================= */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/* =========================
   GET – LẤY CHI TIẾT BLOG
========================= */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: blogId } = await params
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id
  const cacheKey = BLOG_CACHE_KEY(blogId)

  /* ===== REDIS CACHE ===== */
  const cached = await redis.get(cacheKey)
  if (cached) {
    const blog = (typeof cached === 'string' ? JSON.parse(cached) : cached) as any

    // Backward compatibility: nếu cache cũ thiếu field mới (music) thì coi như cache miss
    if (blog && typeof blog === 'object' && !('music' in blog)) {
      // fallthrough to DB
    } else {
      return NextResponse.json({
        ...blog,
        isSaved: currentUserId
          ? blog.savedUserIds?.includes(currentUserId)
          : false,
        liked: currentUserId
          ? blog.likedUserIds?.includes(currentUserId)
          : false,
      })
    }
  }

  try {
    const include: Prisma.BlogInclude = {
      author: {
        select: {
          id: true,
          fullname: true,
          username: true,
          image: true,
        },
      },
      sharedFrom: {
        include: {
          author: {
            select: {
              id: true,
              fullname: true,
              username: true,
              image: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      likes: { select: { userId: true } },
      savedBy: { select: { userId: true } },
    }

    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      include,
    })

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    const cacheData = {
      ...blog,
      likedUserIds: blog.likes.map(l => l.userId),
      savedUserIds: blog.savedBy.map(s => s.userId),
    }

    await redis.set(cacheKey, JSON.stringify(cacheData), { ex: 6000 })

    return NextResponse.json({
      ...cacheData,
      isSaved: currentUserId
        ? cacheData.savedUserIds.includes(currentUserId)
        : false,
      liked: currentUserId
        ? cacheData.likedUserIds.includes(currentUserId)
        : false,
    })
  } catch (error) {
    console.error('GET blog error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    )
  }
}

/* =========================
   PATCH – CHỈNH SỬA BLOG
========================= */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: blogId } = await params
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      include: {
        blogHashtags: {
          include: { hashtag: true },
        },
      },
    })

    if (!blog || blog.authorId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized or not found' },
        { status: 403 }
      )
    }

    const form = await req.formData()
    const caption = (form.get('caption') as string) || ''
    const musicRaw = form.get('music')

    const existingImages: string[] = []
    form.forEach((value, key) => {
      if (key === 'existingImages') {
        existingImages.push(value.toString())
      }
    })

    const newFiles: File[] = []
    form.forEach((value, key) => {
      if (value instanceof File && key === 'newFiles') {
        newFiles.push(value)
      }
    })

    // 🎵 Parse optional music (stored as JSON string)
    // - Not provided => keep existing music as-is (backward compatibility)
    // - Provided empty string => clear music
    // - Provided JSON => set music
    let hasMusicField = false
    let music: unknown = undefined
    if (typeof musicRaw === 'string') {
      hasMusicField = true
      if (!musicRaw.trim()) {
        music = null
      } else {
        try {
          music = JSON.parse(musicRaw)
        } catch {
          return NextResponse.json({ error: 'Music payload is invalid' }, { status: 400 })
        }
      }
    } else if (musicRaw !== null) {
      // Unexpected type (e.g. File)
      hasMusicField = true
      music = null
    }

    const newImageUrls: string[] = [...existingImages]

    for (const file of newFiles) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const safeName = sanitizeFileName(file.name)
      const fileName = `posts/${userId}/${Date.now()}-${safeName}`

      const { error } = await supabase.storage
        .from('instagram')
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        })

      if (error) {
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
      }

      const { data } = supabase.storage
        .from('instagram')
        .getPublicUrl(fileName)

      newImageUrls.push(data.publicUrl)
    }

    // ✅ Rule: music only allowed for image-only posts (no video)
    const isVideoUrl = (url: string) => /\.(mp4|mov|webm)$/i.test(url.split('?')[0] || '')
    const hasVideoFinal =
      existingImages.some(isVideoUrl) || newFiles.some((f) => (f.type || '').startsWith('video'))

    if (hasVideoFinal) {
      // If caller tries to set music while having video => reject.
      // Otherwise force-clear music to keep rule consistent.
      if (hasMusicField && music) {
        return NextResponse.json(
          { error: 'Không thể thêm nhạc cho bài đăng có video. Tính năng nhạc chỉ áp dụng cho post toàn ảnh.' },
          { status: 400 }
        )
      }
      music = null
      hasMusicField = true
    }

    const newTags = extractHashtags(caption)
    const oldTags = blog.blogHashtags.map(bh =>
      bh.hashtag.name.toLowerCase()
    )

    const tagsToAdd = newTags.filter(t => !oldTags.includes(t))
    const tagsToRemove = oldTags.filter(t => !newTags.includes(t))

    for (const tag of tagsToAdd) {
      let hashtag = await prisma.hashtag.findUnique({ where: { name: tag } })

      if (!hashtag) {
        hashtag = await prisma.hashtag.create({
          data: { name: tag, usage_count: 1 },
        })
      } else {
        await prisma.hashtag.update({
          where: { id: hashtag.id },
          data: { usage_count: { increment: 1 } },
        })
      }

      await prisma.blogHashtag.create({
        data: { blog_id: blogId, hashtag_id: hashtag.id },
      })
    }

    for (const tag of tagsToRemove) {
      const hashtag = await prisma.hashtag.findUnique({ where: { name: tag } })
      if (!hashtag) continue

      await prisma.blogHashtag.delete({
        where: {
          blog_id_hashtag_id: {
            blog_id: blogId,
            hashtag_id: hashtag.id,
          },
        },
      })

      await prisma.hashtag.update({
        where: { id: hashtag.id },
        data: { usage_count: { decrement: 1 } },
      })
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: blogId },
      data: {
        caption,
        imageUrls: newImageUrls,
        ...(hasMusicField ? { music: (music ?? null) as any } : {}),
      },
    })

    // ❌ CLEAR CACHE
    await redis.del(BLOG_CACHE_KEY(blogId))

    return NextResponse.json({
      message: 'Blog updated',
      blog: updatedBlog,
    })
  } catch (error) {
    console.error('PATCH blog error:', error)
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    )
  }
}

/* =========================
   DELETE – XÓA BLOG
========================= */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: blogId } = await params
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      include: {
        blogHashtags: {
          include: { hashtag: true },
        },
      },
    })

    if (!blog || blog.authorId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized or not found' },
        { status: 403 }
      )
    }

    const bucketName = 'instagram'
    const filesToDelete: string[] = []

    for (const url of blog.imageUrls ?? []) {
      try {
        const pathname = new URL(url).pathname
        const filePath = pathname.split(`/object/public/${bucketName}/`)[1]
        if (filePath) filesToDelete.push(filePath)
      } catch {}
    }

    if (filesToDelete.length > 0) {
      await supabase.storage.from(bucketName).remove(filesToDelete)
    }

    for (const bh of blog.blogHashtags) {
      const hashtagId = bh.hashtag.id
      if (bh.hashtag.usage_count > 1) {
        await prisma.hashtag.update({
          where: { id: hashtagId },
          data: { usage_count: { decrement: 1 } },
        })
      } else {
        await prisma.hashtag.delete({ where: { id: hashtagId } })
      }
    }

    await prisma.like.deleteMany({ where: { blogId } })
    await prisma.comment.deleteMany({ where: { blogId } })
    await prisma.savedPost.deleteMany({ where: { blogId } })
    await prisma.blog.deleteMany({ where: { sharedFromId: blogId } })
    await prisma.blog.delete({ where: { id: blogId } })

    // ❌ CLEAR CACHE
    await redis.del(BLOG_CACHE_KEY(blogId))

    return NextResponse.json({ message: 'Blog deleted successfully' })
  } catch (error) {
    console.error('DELETE blog error:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    )
  }
}
