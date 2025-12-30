// GET /api/user/[id]/followers
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const followers = await prisma.follow.findMany({
    where: { followingId: id },
    include: { follower: { select: { id: true, fullname: true, username: true, image: true } } }
  })

  return new Response(JSON.stringify(followers.map(f => f.follower)))
}
