// app/profile/[id]/page.tsx
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import ProfileOtherClient from './ProfileOtherClient'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id
  
  // Nếu là chính mình, redirect về /profile
  if (currentUserId === id) {
    const { redirect } = await import('next/navigation')
    redirect('/profile')
  }
  
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      fullname: true,
      username: true,
      createdAt: true,
      blogs: {
        select: {
          id: true,
          caption: true,
          imageUrls: true,
          createdAt: true,
          _count: { select: { likes: true, comments: true } },
          sharedFrom: {
            select: {
              id: true,
              caption: true,
              imageUrls: true,
              createdAt: true,
              author: { select: { id: true, fullname: true, username: true } },
              _count: { select: { likes: true, comments: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  })

  if (!user) return notFound()
  
  // Check follow status nếu có currentUserId
  let isFollowing = false
  if (currentUserId) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: id,
        },
      },
    })
    isFollowing = !!follow
  }

  const userDto = {
    ...user,
    createdAt: user.createdAt.toISOString(),
    blogs: (user.blogs ?? []).map((b) => ({
      ...b,
      createdAt: b.createdAt.toISOString(),
      sharedFrom: b.sharedFrom
        ? {
            ...b.sharedFrom,
            createdAt: b.sharedFrom.createdAt.toISOString(),
          }
        : null,
    })),
  }

  return (
    <ProfileOtherClient
      user={userDto}
      currentUserId={currentUserId ?? null}
      initialIsFollowing={isFollowing}
    />
  )
}