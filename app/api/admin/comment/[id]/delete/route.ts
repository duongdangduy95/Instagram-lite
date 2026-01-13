import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { redis } from "@/lib/redis"
import { invalidateHomeFeed } from "@/lib/cache"
import crypto from "crypto"

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
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: commentId } = await context.params

  const cookieStore = await cookies()
  const token = cookieStore.get("admin_session")?.value

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const session = await prisma.adminsession.findUnique({
    where: { token },
  })
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

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
      adminid: session.adminid,
      action: "DELETE_COMMENT",
      blogid: comment.blogId,
    },
  })

  return NextResponse.json({ success: true })
}
