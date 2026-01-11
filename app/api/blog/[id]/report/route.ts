import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import crypto from "crypto"

const prisma = new PrismaClient()

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id: blogId } = await Promise.resolve(params) // ✅ tránh lỗi "params.id"
    const { reason } = await req.json()
    if (!reason || reason.trim() === "") {
      return NextResponse.json({ error: "Reason required" }, { status: 400 })
    }

    // Lấy session NextAuth
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Kiểm tra blog tồn tại
    const blog = await prisma.blog.findUnique({
      where: { id: blogId }
    })
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // Tạo report
    const report = await prisma.report.create({
      data: {
        id: crypto.randomUUID(),
        reporterid: session.user.id,
        blogid: blogId,
        reason,
        status: "PENDING"
      }
    })

    return NextResponse.json({ ok: true, report })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
