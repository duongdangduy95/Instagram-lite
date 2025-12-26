// /api/conversations/[id]/members.ts
import { prisma } from '@/lib/prisma'

export default async function handler(req: { query: { id: any }; method: string; body: { userId: any } }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { id: string; userId: string; conversationId: string; joinedAt: Date }): any; new(): any }; end: { (): void; new(): any } } }) {
  const { id } = req.query
  if (req.method === 'POST') {
    const { userId } = req.body
    const member = await prisma.participant.create({ data: { conversationId: id, userId } })
    return res.status(200).json(member)
  }
  if (req.method === 'DELETE') {
    const { userId } = req.body
    await prisma.participant.deleteMany({ where: { conversationId: id, userId } })
    return res.status(200).json({ success: true })
  }
  res.status(405).end()
}
