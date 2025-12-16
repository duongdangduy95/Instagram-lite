// GET /api/user/[id]/followers
import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params

  const followers = await prisma.follow.findMany({
    where: { followingId: id },
    include: { follower: { select: { id: true, fullname: true, username: true } } }
  })

  return new Response(JSON.stringify(followers.map(f => f.follower)))
}
