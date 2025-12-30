import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ username: string }>
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params

  // NOTE: username không được đánh dấu @unique trong Prisma schema,
  // nên không dùng findUnique({ where: { username } }) được.
  const user = await prisma.user.findFirst({
    where: { username },
    select: { id: true },
  })

  if (!user) return <div>User not found</div>

  // Dùng lại UI profile hiện có (/profile/[id]) để tránh trùng UI và tránh bug field cũ.
  redirect(`/profile/${user.id}`)
}
