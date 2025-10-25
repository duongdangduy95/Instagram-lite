import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

// PATCH - Update blog
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const session = (await cookieStore).get('session')
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [userId] = session.value.split(':')
  const blogId = params.id

  const form = await req.formData()
  const caption = form.get('caption') as string
  const file = form.get('image') as File | null

  let imageUrl: string | undefined
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${Date.now()}-${file.name}`
    const fs = require('fs')
    const path = require('path')
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename)
    fs.writeFileSync(filepath, buffer)
    imageUrl = `/uploads/${filename}`
  }

  try {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } })
    if (!blog || blog.authorId !== userId)
      return NextResponse.json({ error: 'Unauthorized or not found' }, { status: 403 })

    const updated = await prisma.blog.update({
      where: { id: blogId },
      data: { caption, ...(imageUrl && { imageUrl }) },
    })

    return NextResponse.json({ message: 'Blog updated', blog: updated })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 })
  }
}

// DELETE - Delete blog
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const session = (await cookieStore).get('session')
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [userId] = session.value.split(':')
  const blogId = params.id

  try {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } })
    if (!blog || blog.authorId !== userId)
      return NextResponse.json({ error: 'Unauthorized or not found' }, { status: 403 })

    await prisma.blog.delete({ where: { id: blogId } })

    return NextResponse.json({ message: 'Blog deleted' })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 })
  }
}
