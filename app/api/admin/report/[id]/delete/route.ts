import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import crypto from "crypto"
import { verifyAdminSession } from "@/lib/admin-auth"

const prisma = new PrismaClient()

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // Next.js 15: params là Promise
) {
  // ✅ Verify admin session và check whitelist
  const auth = await verifyAdminSession(req)
  if (!auth.authorized) {
    return auth.response!
  }
  
  // ✅ await params trước khi dùng
  const { id: reportId } = await context.params
  const { adminId } = auth.session!

  const report = await prisma.report.findUnique({
    where: { id: reportId },
  })
  if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 })

  // Soft delete blog
  await prisma.blog.update({
    where: { id: report.blogid },
    data: { isdeleted: true },
  })


    // Lấy blog để xác định owner
  const blog = await prisma.blog.findUnique({
    where: { id: report.blogid },
    select: { id: true, authorId: true },
  })

  if (blog) {
    await prisma.notification.create({
      data: {
        id: crypto.randomUUID(),
        userId: blog.authorId,        
        actorId: blog.authorId,     
        type: 'BLOG_DELETED',
        blogId: blog.id,
        isRead: false,
        createdAt: new Date(),
      },
    })
  }



  // Update report status
  await prisma.report.update({
    where: { id: report.id },
    data: { status: "APPROVED" },
  })

  // Log admin action
  await prisma.adminactionlog.create({
    data: {
      id: crypto.randomUUID(),
      adminid: adminId,
      action: "DELETE_BLOG",
      blogid: report.blogid,
      reportid: report.id,
    },
  })

  return NextResponse.json({ ok: true })
}
