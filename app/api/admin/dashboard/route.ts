import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET() {
  const reports = await prisma.report.findMany({
    where: { status: "PENDING" },
    include: {
      Blog: {
        include: {
          author: true,
          comments: true,
          likes: true,
          sharedFrom: {
            include: { author: true },
          },
        },
      },
    },
    orderBy: { createdat: "desc" },
  })

  const blogs = reports.map(r => {
    const b = r.Blog
    return {
      ...b,
      _count: {
        likes: b.likes.length,
        comments: b.comments.length,
      },
    }
  })

  return NextResponse.json({ blogs })
}
