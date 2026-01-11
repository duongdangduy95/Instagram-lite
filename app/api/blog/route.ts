// app/api/blog/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { invalidateHomeFeed } from '@/lib/cache'


export async function POST(req: Request) {
  const data = await req.json();

  const blog = await prisma.blog.create({
    data,
  });
  await invalidateHomeFeed()
  return NextResponse.json(blog);
}