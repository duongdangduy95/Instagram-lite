import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notification'
import { NotificationType } from '@prisma/client'

export async function notifyComment({
  blogId,
  commentId,
  actorId,
  parentId,
}: {
  blogId: string
  commentId: string
  actorId: string
  parentId?: string | null
}) {
  // 1️⃣ Lấy thông tin cần thiết
  const blog = await prisma.blog.findUnique({
    where: { id: blogId },
    select: { authorId: true },
  })

  if (!blog) return

  let parentCommentAuthorId: string | null = null

  // 2️⃣ Nếu là reply → notify người bị reply
  if (parentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: parentId },
      select: { authorId: true },
    })

    if (
      parentComment &&
      parentComment.authorId !== actorId
    ) {
      parentCommentAuthorId = parentComment.authorId

      await createNotification({
        userId: parentComment.authorId,
        actorId,
        type: NotificationType.REPLY_COMMENT,
        blogId,
        commentId,
      })
    }
  }

  // 3️⃣ Notify chủ bài (nếu không trùng & không tự gửi)
  if (
    blog.authorId !== actorId &&
    blog.authorId !== parentCommentAuthorId
  ) {
    await createNotification({
      userId: blog.authorId,
      actorId,
      type: NotificationType.COMMENT_POST,
      blogId,
      commentId,
    })
  }
}
