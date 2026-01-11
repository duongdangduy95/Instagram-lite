import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET() {
  const reports = await prisma.report.findMany({
    where: { status: "PENDING" },
    include: {
      User: {                // 👈 lấy người report
        select: {
          id: true,
          username: true,
        },
      },
      Blog: {
        include: {
          author: true,
        },
      },
    },
    orderBy: { createdat: "desc" },
  })

  const blogs = reports.map(r => ({
    ...r.Blog,
    reportId: r.id,
    reportReason: r.reason,
    reporter: r.User,       // 👈 gửi cho frontend
  }))

  return NextResponse.json({ blogs })
}
