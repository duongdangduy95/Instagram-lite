// GET /api/user/[id]/following
import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params

  const following = await prisma.follow.findMany({
    where: { followerId: id },
    include: { following: { select: { id: true, fullname: true, username: true } } }
  })

  return new Response(JSON.stringify(following.map(f => f.following)))
}
