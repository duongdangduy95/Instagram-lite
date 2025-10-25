// app/api/search/route.ts
import { NextResponse } from 'next/server'
import {prisma} from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''

  const blogs = await prisma.blog.findMany({
    where: {
      OR: [
        { caption: { contains: q, mode: 'insensitive' } },
        { author: { username: { contains: q, mode: 'insensitive' } } },
      ],
    },
    include: {
      author: true,
    },
  })

  return NextResponse.json(blogs)
}
