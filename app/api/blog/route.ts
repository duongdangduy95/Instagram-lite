// app/api/blog/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function POST(req: Request) {
  const data = await req.json();

  const blog = await prisma.blog.create({
    data,
  });

  return NextResponse.json(blog);
}
