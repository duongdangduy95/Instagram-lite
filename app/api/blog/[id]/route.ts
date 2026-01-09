import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'
import { Prisma } from '@prisma/client'

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
    .normalize('NFD')                    // tách dấu
    .replace(/[\u0300-\u036f]/g, '')     // bỏ dấu
    .replace(/[^a-zA-Z0-9._-]/g, '-')    // ký tự lạ → -
    .replace(/-+/g, '-')                 // gộp ---
    .toLowerCase()
}


/* =========================
   GET – LẤY CHI TIẾT BLOG
========================= */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: blogId } = await params

  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id



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
    }

    if (currentUserId) {
      include.likes = {
        where: { userId: currentUserId },
        select: { userId: true },
      }
      include.savedBy = {
        where: { userId: currentUserId },
        select: { userId: true },
      }
    }

    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      include,
    })

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    const result = {
      ...blog,
      isSaved: currentUserId ? (blog.savedBy?.length ?? 0) > 0 : false,
    }

    return NextResponse.json(result)
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
          include: {
            hashtag: true,
          },
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

    /* ẢNH CŨ GIỮ LẠI */
    const existingImages: string[] = []
    form.forEach((value, key) => {
      if (key === 'existingImages') {
        existingImages.push(value.toString())
      }
    })

    /* FILE MỚI */
    const newFiles: File[] = []
    form.forEach((value, key) => {
      if (value instanceof File && key === 'newFiles') {
        newFiles.push(value)
      }
    })

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
        console.error('Supabase upload error:', error)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
      }

      const { data } = supabase.storage.from('instagram').getPublicUrl(fileName)
      newImageUrls.push(data.publicUrl)
    }

    const newTags = extractHashtags(caption)

    const oldTags = blog.blogHashtags.map(bh =>
      bh.hashtag.name.toLowerCase()
    )

    const tagsToAdd = newTags.filter(t => !oldTags.includes(t))
    const tagsToRemove = oldTags.filter(t => !newTags.includes(t))


    //  thêm hashtag
    for (const tag of tagsToAdd) {
      let hashtag = await prisma.hashtag.findUnique({
        where: { name: tag },
      })

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
        data: {
          blog_id: blogId,
          hashtag_id: hashtag.id,
        },
      })
    }

    // xoá hashtag
    for (const tag of tagsToRemove) {
      const hashtag = await prisma.hashtag.findUnique({
        where: { name: tag },
      })

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
      },
    })

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
          include: {
            hashtag: true,
          },
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

        if (filePath) {
          filesToDelete.push(filePath)
        }
      } catch {
      }
    }

    if (filesToDelete.length > 0) {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove(filesToDelete)

      if (error) {
        console.error('Supabase delete error:', error)
      }
    }

    for (const bh of blog.blogHashtags) {
      const hashtagId = bh.hashtag.id

      // 1. Xóa liên kết blog_hashtag
      await prisma.blogHashtag.delete({
        where: {
          blog_id_hashtag_id: {
            blog_id: blogId,
            hashtag_id: hashtagId,
          },
        },
      })

      // 2. Lấy usage_count hiện tại
      const current = bh.hashtag.usage_count

      if (current > 1) {
        // 3a. Còn blog khác dùng → giảm
        await prisma.hashtag.update({
          where: { id: hashtagId },
          data: {
            usage_count: { decrement: 1 },
          },
        })
      } else {
        // 3b. usage_count = 1 → xóa luôn hashtag
        await prisma.hashtag.delete({
          where: { id: hashtagId },
        })
      }
    }



    await prisma.like.deleteMany({
      where: { blogId },
    })

    await prisma.comment.deleteMany({
      where: { blogId },
    })

    await prisma.savedPost.deleteMany({
      where: { blogId },
    })

    await prisma.blog.deleteMany({
      where: { sharedFromId: blogId },
    })

    await prisma.blog.delete({
      where: { id: blogId },
    })

    return NextResponse.json({ message: 'Blog deleted successfully' })
  } catch (error) {
    console.error('DELETE blog error:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    )
  }
}


