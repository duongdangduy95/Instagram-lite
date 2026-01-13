import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { redis } from "@/lib/redis"
import { invalidateHomeFeed } from "@/lib/cache"
import crypto from "crypto"
import { verifyAdminSession } from "@/lib/admin-auth"

const prisma = new PrismaClient()

const COMMENTS_CACHE_KEY = (blogId: string) => `comments:blog:${blogId}`

// Xóa comment đệ quy (bao gồm cả replies)
async function deleteCommentRecursive(commentId: string) {
  const children = await prisma.comment.findMany({
    where: { parentId: commentId },
    select: { id: true },
  })

  for (const child of children) {
    await deleteCommentRecursive(child.id)
  }

  await prisma.like.deleteMany({
    where: { commentId },
  })

  await prisma.comment.delete({
    where: { id: commentId },
  })
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // ✅ Verify admin session và check whitelist
  const auth = await verifyAdminSession(req)
  if (!auth.authorized) {
    return auth.response!
  }
  
  const { id: commentId } = await context.params
  const { adminId } = auth.session!

  // Lấy comment để lấy blogId
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: {
      id: true,
      blogId: true,
    },
  })

  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 })
  }

  // Xóa comment và tất cả replies
  await deleteCommentRecursive(commentId)

  // Clear cache
  await redis.del(COMMENTS_CACHE_KEY(comment.blogId))
  await invalidateHomeFeed()

  // Log admin action
  await prisma.adminactionlog.create({
    data: {
      id: crypto.randomUUID(),
      adminid: adminId,
      action: "DELETE_COMMENT",
      blogid: comment.blogId,
    },
  })

  return NextResponse.json({ success: true })
}
