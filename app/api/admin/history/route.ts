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
  
  const logs = await prisma.adminactionlog.findMany({
    orderBy: { createdat: "desc" },
    take: 100,
    include: {
      admin: { select: { username: true } },
      blog: { select: { caption: true, author: { select: { username: true } } } },
      report: {
        select: {
          reason: true,
          User: { select: { username: true } },  // reporter
          Blog: { select: { caption: true, author: { select: { username: true } } } }, // blog của report
        },
      },
    },
  })


  const history = logs.map(log => {
    // ưu tiên blog trực tiếp, fallback blog từ report
    const blog = log.blog ?? log.report?.Blog

    return {
      id: log.id,
      action: log.action,
      createdAt: log.createdat,
      admin: log.admin?.username || "UNKNOWN",

      blog: blog
        ? {
            caption: blog.caption,
            author: blog.author?.username || "UNKNOWN",
          }
        : null,

      report: log.report
        ? {
            reporter: log.report.User?.username || "UNKNOWN",
            reason: log.report.reason,
          }
        : null,
    }
  })


  return NextResponse.json({ history })
}
