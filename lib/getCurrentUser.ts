// lib/getCurrentUser.ts
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function getCurrentUser() {
  const session = (await cookies()).get('session')?.value
  if (!session) return null

  const [userId] = session.split(':')
  if (!userId) return null

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  return user
}
