// app/api/blog/[id]/like/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const blogId = params.id;
  const userId = req.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ liked: false });
  }

  const existing = await prisma.like.findFirst({
    where: { blogId, userId },
  });

  return NextResponse.json({ liked: !!existing });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const blogId = params.id;
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const existing = await prisma.like.findFirst({
    where: { blogId, userId },
  });

  if (existing) {
    // Nếu đã like -> unlike
    await prisma.like.delete({ where: { id: existing.id } });
    return NextResponse.json({ liked: false });
  } else {
    // Nếu chưa like -> like
    await prisma.like.create({
      data: { blogId, userId },
    });
    return NextResponse.json({ liked: true });
  }
}
