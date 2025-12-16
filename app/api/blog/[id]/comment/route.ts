import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function getCurrentUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return session.user.id;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: blogId } = await params
  const comments = await prisma.comment.findMany({
    where: { blogId },
    include: {
      author: { select: { fullname: true, username: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json(comments);
}
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: blogId } = await params
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { content, parentId } = body;

  if (!content) {
    return NextResponse.json({ error: 'Missing content' }, { status: 400 });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: userId,
        blogId,
        parentId: parentId || null,
      },
      include: {
        author: {
          select: {
            fullname: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (err) {
    console.error('API ERROR:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
