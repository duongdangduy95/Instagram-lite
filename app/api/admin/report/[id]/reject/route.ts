
// app/api/admin/report/[id]/reject/route.ts
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import crypto from "crypto"
import { cookies } from "next/headers"

export const runtime = "nodejs"

const prisma = new PrismaClient()

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reportId } = await params
    
    if (!reportId) {
      return NextResponse.json({ error: "Report ID missing" }, { status: 400 })
    }
    
    // Debug: Kiểm tra tất cả cookies
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()

    
    const token = cookieStore.get("admin_session")?.value

    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized - No token" }, { status: 401 })
    }
    
    const session = await prisma.adminsession.findUnique({ 
      where: { token },
      include: { admin: true }
    })
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized - Invalid session" }, { status: 401 })
    }
    
    // Kiểm tra session expired
    if (session.expiresat < new Date()) {
      return NextResponse.json({ error: "Unauthorized - Session expired" }, { status: 401 })
    }
    
    //  Update report
    const report = await prisma.report.update({
      where: { id: reportId },
      data: { status: "REJECTED" },
    })
    
    // Log action
    await prisma.adminactionlog.create({
      data: {
        id: crypto.randomUUID(),
        adminid: session.adminid,
        action: "REJECT_REPORT",
        reportid: report.id,
      },
    })
    
    
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}