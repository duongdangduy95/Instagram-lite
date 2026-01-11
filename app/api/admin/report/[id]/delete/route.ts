import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import crypto from "crypto"

const prisma = new PrismaClient()

export async function POST(
  req: Request,
  context: { params: { id: string } } // Next.js sẽ cung cấp params dưới dạng Promise
) {
  // ✅ await params trước khi dùng
  const { id: reportId } = await context.params

  // ✅ cookies() là async
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_session")?.value

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const session = await prisma.adminsession.findUnique({
    where: { token },
  })
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const report = await prisma.report.findUnique({
    where: { id: reportId },
  })
  if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 })

  // Soft delete blog
  await prisma.blog.update({
    where: { id: report.blogid },
    data: { isdeleted: true },
  })

  // Update report status
  await prisma.report.update({
    where: { id: report.id },
    data: { status: "APPROVED" },
  })

  // Log admin action
  await prisma.adminactionlog.create({
    data: {
      id: crypto.randomUUID(),
      adminid: session.adminid,
      action: "DELETE_BLOG",
      blogid: report.blogid,
      reportid: report.id,
    },
  })

  return NextResponse.json({ ok: true })
}
