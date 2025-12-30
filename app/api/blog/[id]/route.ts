import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'
 
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
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      include: {
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
 
    const newImageUrls: string[] = [...existingImages]
 
    for (const file of newFiles) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const fileName = `posts/${userId}/${Date.now()}-${file.name}`
 
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
 
    await prisma.$transaction([
      prisma.like.deleteMany({
        where: { blogId },
      }),
      prisma.comment.deleteMany({
        where: { blogId },
      }),
      prisma.blog.delete({
        where: { id: blogId },
      }),
    ])
 
    return NextResponse.json({ message: 'Blog deleted successfully' })
  } catch (error) {
    console.error('DELETE blog error:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    )
  }
}
 
 
 