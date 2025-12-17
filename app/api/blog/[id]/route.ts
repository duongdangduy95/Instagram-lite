import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = cookies()
  const session = (await cookieStore).get('session')
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [userId] = session.value.split(':')
  const { id: blogId } = await params

  const form = await req.formData()
  const caption = form.get('caption') as string
  const hashtagsStr = form.get('hashtags') as string
  const hashtags = hashtagsStr ? JSON.parse(hashtagsStr) : []

  const existingImages: string[] = []
  form.forEach((v, key) => {
    if (key === 'existingImages') existingImages.push(v.toString())
  })

  const files: File[] = []
  form.forEach((v, key) => {
    if (v instanceof File && (key === 'images' || key === 'videos')) {
      files.push(v)
    }
  })
  

  const newImageUrls: string[] = [...existingImages]

  for (const file of files) {
    if (file.size === 0) continue
    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${Date.now()}-${file.name}`
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename)
    fs.writeFileSync(filepath, buffer)
    newImageUrls.push(`/uploads/${filename}`)
  }

  try {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } })
    if (!blog || blog.authorId !== userId)
      return NextResponse.json({ error: 'Unauthorized or not found' }, { status: 403 })

    const updated = await prisma.blog.update({
      where: { id: blogId },
      data: {
        caption,
        hashtags,
        imageUrls: newImageUrls,
      },
    })

    return NextResponse.json({ message: 'Blog updated', blog: updated })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 })
  }
}


// DELETE - Delete blog
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = cookies()
  const session = (await cookieStore).get('session')
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [userId] = session.value.split(':')
  const { id: blogId } = await params

  try {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } })
    if (!blog || blog.authorId !== userId)
      return NextResponse.json({ error: 'Unauthorized or not found' }, { status: 403 })

    await prisma.blog.delete({ where: { id: blogId } })
    for (const url of blog.imageUrls) {
      const filepath = path.join(process.cwd(), 'public', url.replace('/uploads/', 'uploads/'))
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
    }
    

    return NextResponse.json({ message: 'Blog deleted' })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 })
  }
}