import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

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

  try {
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      include: {
        author: {
          select: {
            id: true,
            fullname: true,
            username: true,
          },
        },
        sharedFrom: {
          include: {
            author: {
              select: {
                id: true,
                fullname: true,
                username: true,
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
        likes: currentUserId
          ? {
              where: { userId: currentUserId },
              select: { userId: true },
            }
          : undefined,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    return NextResponse.json(blog)
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
    const blog = await prisma.blog.findUnique({ where: { id: blogId } })
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

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const newImageUrls: string[] = [...existingImages]

    for (const file of newFiles) {
      if (file.size === 0) continue

      const buffer = Buffer.from(await file.arrayBuffer())
      const safeName = file.name.replace(/\s+/g, '_')
      const filename = `${Date.now()}-${safeName}`
      const filepath = path.join(uploadDir, filename)

      fs.writeFileSync(filepath, buffer)
      newImageUrls.push(`/uploads/${filename}`)
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
    const blog = await prisma.blog.findUnique({ where: { id: blogId } })
    if (!blog || blog.authorId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized or not found' },
        { status: 403 }
      )
    }

    await prisma.blog.delete({ where: { id: blogId } })

    /* XÓA FILE LOCAL */
    for (const url of blog.imageUrls) {
      if (!url.startsWith('/uploads/')) continue
      const filepath = path.join(process.cwd(), 'public', url)
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
      }
    }

    return NextResponse.json({ message: 'Blog deleted' })
  } catch (error) {
    console.error('DELETE blog error:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    )
  }
}
