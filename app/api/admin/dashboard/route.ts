import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { verifyAdminSession } from "@/lib/admin-auth"

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  // ✅ Verify admin session và check whitelist
  const auth = await verifyAdminSession(req)
  if (!auth.authorized) {
    return auth.response!
  }
  
  const reports = await prisma.report.findMany({
    where: { status: "PENDING" },
    include: {
      User: {                
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
    reporter: r.User,      
  }))

  return NextResponse.json({ blogs })
}
