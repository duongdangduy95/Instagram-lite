import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      blogs: {
        include: {
          _count: { select: { likes: true, comments: true } },
          likes: { select: { userId: true } },
          author: { select: { id: true, fullname: true, username: true, image: true } },
          sharedFrom: {
            include: {
              author: { select: { id: true, fullname: true, username: true, image: true } },
              _count: { select: { likes: true, comments: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      likes: {
        include: {
          blog: {
            include: {
              _count: { select: { likes: true, comments: true } },
              likes: { select: { userId: true } },
              author: { select: { id: true, fullname: true, username: true, image: true } },
              sharedFrom: {
                include: {
                  author: { select: { id: true, fullname: true, username: true, image: true } },
                  _count: { select: { likes: true, comments: true } },
                },
              },
            },
          },
        },
      },
      following: true,
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Map blogs để client dùng imageUrls
  const userWithMappedBlogs = {
    ...user,
    blogs: user.blogs.map(blog => ({
      ...blog,
      imageUrls: blog.imageUrls || [], // imageUrl -> imageUrls
    })),
  }

  return NextResponse.json(userWithMappedBlogs)
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  const contentType = req.headers.get('content-type') || ''
  let fullname: string | undefined
  let username: string | undefined
  let phone: string | undefined
  let avatarFile: File | null = null

  // Hỗ trợ cả JSON (cũ) và multipart/form-data (mới, để upload avatar)
  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData()
    fullname = (form.get('fullname') as string) || undefined
    username = (form.get('username') as string) || undefined
    phone = (form.get('phone') as string) || undefined
    const avatar = form.get('avatar')
    avatarFile = avatar instanceof File && avatar.size > 0 ? avatar : null
  } else {
    const json = (await req.json().catch(() => ({}))) as Partial<{
      fullname: string
      username: string
      phone: string
    }>
    fullname = json.fullname
    username = json.username
    phone = json.phone
  }

  try {
    // Validate & check trùng username (bắt buộc unique cho route /user/[username])
    if (typeof username === 'string') {
      const nextUsername = username.trim()
      if (nextUsername.length < 3 || nextUsername.length > 30) {
        return NextResponse.json(
          { error: 'Username phải có 3-30 ký tự' },
          { status: 400 }
        )
      }
      if (!/^[a-zA-Z0-9._]+$/.test(nextUsername)) {
        return NextResponse.json(
          { error: 'Username chỉ được chứa chữ, số, dấu chấm và gạch dưới' },
          { status: 400 }
        )
      }

      const existed = await prisma.user.findFirst({
        where: { username: nextUsername, NOT: { id: userId } },
        select: { id: true },
      })
      if (existed) {
        return NextResponse.json({ error: 'Username đã được sử dụng' }, { status: 409 })
      }

      username = nextUsername
    }

    // Upload avatar nếu có
    let imageUrl: string | undefined
    if (avatarFile) {
      const buffer = Buffer.from(await avatarFile.arrayBuffer())
      const ext = avatarFile.type?.split('/')[1] || 'jpg'
      const fileName = `avatars/${userId}/${Date.now()}.${ext}`

      const { error } = await supabase.storage.from('instagram').upload(fileName, buffer, {
        contentType: avatarFile.type,
        upsert: true,
      })

      if (error) {
        console.error('Supabase upload error:', error)
        return NextResponse.json({ error: 'Upload avatar failed' }, { status: 500 })
      }

      const { data } = supabase.storage.from('instagram').getPublicUrl(fileName)
      imageUrl = data.publicUrl
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullname && { fullname }),
        ...(username && { username }),
        ...(phone && { phone }),
        ...(imageUrl && { image: imageUrl }),
      },
      include: {
        blogs: { orderBy: { createdAt: 'desc' } },
        likes: {
          include: {
            blog: {
              include: {
                author: true,
              },
            },
          },
        },
        following: true,
        _count: { select: { following: true, followers: true } },
      },
    })

    // Map blogs để client dùng imageUrls
    const updatedUserWithMappedBlogs = {
      ...updatedUser,
      blogs: updatedUser.blogs.map(blog => ({
        ...blog,
        imageUrls: blog.imageUrls || [],
      })),
    }

    return NextResponse.json(updatedUserWithMappedBlogs)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}