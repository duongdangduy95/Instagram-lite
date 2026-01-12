import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { redis } from '@/lib/redis'
import { bumpMeVersion, getMeCacheKey } from '@/lib/cache'

export const dynamic = 'force-dynamic'

const CACHE_TTL = 30 // TTL ngắn; realtime đến từ bumpMeVersion khi có mutation

/* ======================= GET ME ======================= */
export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const cacheKey = await getMeCacheKey(userId)

  try {
    // 🔥 1. Redis first
    const cached = await redis.get(cacheKey)
    if (cached) {
      const parsed = typeof cached === 'string' ? JSON.parse(cached) : cached
      return NextResponse.json(parsed)
    }


    // 🐢 2. DB fallback
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        blogs: {
          where: { isdeleted: false },
          include: {
            _count: { select: { likes: true, comments: true } },
            likes: { select: { userId: true } },
            author: {
              select: { id: true, fullname: true, username: true, image: true },
            },
            sharedFrom: {
              include: {
                author: {
                  select: { id: true, fullname: true, username: true, image: true },
                },
                _count: { select: { likes: true, comments: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        likes: {
          include: {
            blog: {
              where: { isdeleted: false },
              include: {
                _count: { select: { likes: true, comments: true } },
                likes: { select: { userId: true } },
                author: {
                  select: { id: true, fullname: true, username: true, image: true },
                },
                sharedFrom: {
                  include: {
                    author: {
                      select: { id: true, fullname: true, username: true, image: true },
                    },
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

    const userWithMappedBlogs = {
      ...user,
      blogs: user.blogs.filter(blog => !blog.isdeleted).map((blog) => ({
        ...blog,
        imageUrls: blog.imageUrls || [],
      })),
    }

    // ⚡ 3. Cache result
    await redis.set(cacheKey, JSON.stringify(userWithMappedBlogs), { ex: CACHE_TTL })

    return NextResponse.json(userWithMappedBlogs)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 })
  }
}

/* ======================= PATCH ME ======================= */
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
    // Validate username
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

    // Upload avatar
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
            blog: { include: { author: true } },
          },
        },
        following: true,
        _count: { select: { following: true, followers: true } },
      },
    })

    const updatedUserWithMappedBlogs = {
      ...updatedUser,
      blogs: updatedUser.blogs.map((blog) => ({
        ...blog,
        imageUrls: blog.imageUrls || [],
      })),
    }

    // 🧹 Invalidate cache (versioning)
    await bumpMeVersion(userId)

    return NextResponse.json(updatedUserWithMappedBlogs)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
