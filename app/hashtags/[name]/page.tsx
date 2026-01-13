// app/hashtags/[name]/page.tsx
import { prisma } from '@/lib/prisma'
import Navigation from '@/app/components/Navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import HomeClient from '@/app/home/HomeClient'
import { notFound } from 'next/navigation'
import type { BlogDTO, CurrentUserSafe, SuggestUserDTO } from '@/types/dto'

type PageProps = {
  params: Promise<{ name: string }>
}

// ===== LẤY USER HIỆN TẠI (GIỐNG HOME) =====
async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, fullname: true, username: true },
  })
}

export default async function HashtagPage({ params }: PageProps) {
  const { name } = await params
  const hashtag = name?.toLowerCase()
  if (!hashtag) notFound()

  const currentUser = await getCurrentUser()

  // ===== SUGGEST USERS (GIỐNG HOME) =====
  const users = await prisma.user.findMany({
    where: currentUser ? { id: { not: currentUser.id } } : undefined,
    select: {
      id: true,
      fullname: true,
      username: true,
      followers: currentUser
        ? { select: { followerId: true }, where: { followerId: currentUser.id } }
        : undefined,
      _count: {
        select: {
          followers: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  // ===== BLOGS THEO HASHTAG =====
  const blogs = await prisma.blog.findMany({
    where: {
      blogHashtags: {
        some: {
          hashtag: {
            name: hashtag,
          },
        },
      },
      isdeleted: false, // Chỉ lấy bài chưa bị xóa
    },
    select: {
      id: true,
      caption: true,
      imageUrls: true,
      music: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          fullname: true,
          username: true,
          image: true,
          followers: currentUser
            ? { select: { followerId: true }, where: { followerId: currentUser.id } }
            : undefined,
        },
      },
      sharedFrom: {
        select: {
          id: true,
          isdeleted: true,
          caption: true,
          imageUrls: true,
          music: true,
          createdAt: true,
          author: { select: { id: true, fullname: true, username: true, image: true } },
          _count: { select: { likes: true, comments: true } },
        },
      },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 10, // Giới hạn số lượng ban đầu
  })

  // ===== LOAD TRẠNG THÁI CÁ NHÂN (Like, Save) - GIỐNG API HOME =====
  const blogIds = blogs.map((b) => b.id)
  const [likes, saved] = await Promise.all([
    currentUser
      ? prisma.like.findMany({
          where: { userId: currentUser.id, blogId: { in: blogIds } },
          select: { blogId: true },
        })
      : Promise.resolve([]),
    currentUser
      ? prisma.savedPost.findMany({
          where: { userId: currentUser.id, blogId: { in: blogIds } },
          select: { blogId: true },
        })
      : Promise.resolve([]),
  ])

  const likedSet = new Set(likes.map((l) => l.blogId))
  const savedSet = new Set(saved.map((s) => s.blogId))

  // ===== SERIALIZE DATE VÀ MERGE TRẠNG THÁI =====
  const blogsDto: BlogDTO[] = blogs.map((b) => {
    // Parse music nếu là string
    let parsedMusic = b.music as BlogDTO['music']
    if (parsedMusic && typeof parsedMusic === 'string') {
      try {
        parsedMusic = JSON.parse(parsedMusic)
      } catch {
        parsedMusic = null
      }
    }

    // Parse sharedFrom music nếu có
    let parsedSharedFrom: BlogDTO['sharedFrom'] = null
    if (b.sharedFrom) {
      let parsedSharedMusic = b.sharedFrom.music
      if (parsedSharedMusic && typeof parsedSharedMusic === 'string') {
        try {
          parsedSharedMusic = JSON.parse(parsedSharedMusic)
        } catch {
          parsedSharedMusic = null
        }
      }

      parsedSharedFrom = {
        ...b.sharedFrom,
        music: parsedSharedMusic as BlogDTO['music'],
        createdAt: b.sharedFrom.createdAt.toISOString(),
      }
    }

    return {
      ...b,
      music: parsedMusic,
      createdAt: b.createdAt.toISOString(),
      sharedFrom: parsedSharedFrom,
      // Set liked và isSaved giống API home
      liked: currentUser ? likedSet.has(b.id) : false,
      isSaved: currentUser ? savedSet.has(b.id) : false,
    } as BlogDTO
  })

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white">
      {/* NAVIGATION → LỐI THOÁT */}
      <Navigation />

      {/* FEED GIỐNG HOME */}
      <HomeClient
        blogs={blogsDto}
        users={users as SuggestUserDTO[]}
        currentUser={currentUser as CurrentUserSafe}
        mode="hashtag"
        hashtagName={hashtag}
      >
        {/* HEADER HASHTAG - MOVED INSIDE HOMECLIENT */}
        <div className="px-4 pt-2 pb-4 border-b border-gray-800 mb-4">
          <h1 className="text-3xl font-bold text-[#7565E6] mb-2">
            #{hashtag}
          </h1>
          <p className="text-gray-400 font-medium">
            {blogsDto.length} bài viết
          </p>
        </div>
      </HomeClient>
    </div>
  )
}
