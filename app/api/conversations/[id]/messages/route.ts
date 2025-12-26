// app/api/conversations/[id]/messages/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userId = req.headers.get('x-user-id'); // lấy từ session/auth
  const conversationId = params.id;

  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // ✅ Kiểm tra participant
  const participant = await prisma.participant.findUnique({
    where: { userId_conversationId: { userId, conversationId } }
  });

  if (!participant) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: { sender: true },
      orderBy: { createdAt: 'asc' }, // cũ → mới
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const conversationId = params.id;
  const { content, senderId } = await req.json();

  if (!content || !senderId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // ✅ Kiểm tra participant
  const participant = await prisma.participant.findUnique({
    where: { userId_conversationId: { userId: senderId, conversationId } }
  });

  if (!participant) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    // Tạo message mới
    const message = await prisma.message.create({
      data: { conversationId, senderId, content },
      include: { sender: true },
    });

    // Cập nhật updatedAt của conversation
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
