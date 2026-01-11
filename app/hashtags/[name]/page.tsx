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
          caption: true,
          imageUrls: true,
          music: true,
          createdAt: true,
          author: { select: { id: true, fullname: true, username: true, image: true } },
          _count: { select: { likes: true, comments: true } },
        },
      },
      likes: currentUser
        ? { select: { userId: true }, where: { userId: currentUser.id } }
        : undefined,
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // ===== SERIALIZE DATE =====
  const blogsDto: BlogDTO[] = blogs.map((b) => ({
    ...b,
    music: b.music as BlogDTO['music'],
    createdAt: b.createdAt.toISOString(),
    sharedFrom: b.sharedFrom
      ? {
        ...b.sharedFrom,
        music: b.sharedFrom.music as BlogDTO['music'],
        createdAt: b.sharedFrom.createdAt.toISOString(),
      }
      : null,
  }))

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
