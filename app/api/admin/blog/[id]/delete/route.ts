import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import crypto from "crypto"
import { invalidateHomeFeed } from "@/lib/cache"
import { verifyAdminSession } from "@/lib/admin-auth"

const prisma = new PrismaClient()

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // ✅ Verify admin session và check whitelist
  const auth = await verifyAdminSession(req)
  if (!auth.authorized) {
    return auth.response!
  }
  
  const { id: blogId } = await context.params
  const { adminId } = auth.session!

  // Kiểm tra blog có tồn tại không
  const blog = await prisma.blog.findUnique({
    where: { id: blogId },
    select: { id: true, authorId: true, isdeleted: true },
  })

  if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 })
  if (blog.isdeleted) return NextResponse.json({ error: "Blog already deleted" }, { status: 400 })

  // Soft delete blog
  await prisma.blog.update({
    where: { id: blogId },
    data: { 
      isdeleted: true,
      deletedbyadmin: adminId,
      deletedat: new Date(),
    },
  })

  // Tạo notification cho author
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

  // Log admin action
  await prisma.adminactionlog.create({
    data: {
      id: crypto.randomUUID(),
      adminid: adminId,
      action: "DELETE_BLOG",
      blogid: blog.id,
    },
  })

  // Invalidate cache để feed reload ngay
  await invalidateHomeFeed()

  return NextResponse.json({ ok: true })
}
