import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(req: Request, { params }: RouteContext) {
  const { id: conversationId } = await params
  const body = (await req.json()) as { userId?: string }

  if (!body.userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  const member = await prisma.participant.create({
    data: { conversationId, userId: body.userId },
  })
  return NextResponse.json(member)
}

export async function DELETE(req: Request, { params }: RouteContext) {
  const { id: conversationId } = await params
  const body = (await req.json()) as { userId?: string }

  if (!body.userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  await prisma.participant.deleteMany({
    where: { conversationId, userId: body.userId },
  })
  return NextResponse.json({ success: true })
}
