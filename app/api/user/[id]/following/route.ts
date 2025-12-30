// GET /api/user/[id]/following
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const following = await prisma.follow.findMany({
    where: { followerId: id },
    include: { following: { select: { id: true, fullname: true, username: true, image: true } } }
  })

  return new Response(JSON.stringify(following.map(f => f.following)))
}
