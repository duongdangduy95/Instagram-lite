import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

async function getCurrentUserId() {
  const session = (await cookies()).get('session')?.value;
  if (!session) return null;
  const userId = session.split(':')[0];
  return userId;
}
// Lấy tất cả comment (dạng cây nhưng client sẽ làm phẳng)
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const comments = await prisma.comment.findMany({
    where: { blogId: params.id },
    include: {
      author: { select: { fullname: true, username: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json(comments);
}
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const blogId = params.id;
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

export async function DELETE(req: NextRequest, { params }: { params: { commentId: string } }) {
  try {
    const { commentId } = params;

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE COMMENT ERROR:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}


