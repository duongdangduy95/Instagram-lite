
// app/api/admin/report/[id]/reject/route.ts
import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { verifyAdminSession } from "@/lib/admin-auth"

export const runtime = "nodejs"

const prisma = new PrismaClient()

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Verify admin session và check whitelist
    const auth = await verifyAdminSession(req)
    if (!auth.authorized) {
      return auth.response!
    }
    
    const { id: reportId } = await params
    const { adminId } = auth.session!
    
    if (!reportId) {
      return NextResponse.json({ error: "Report ID missing" }, { status: 400 })
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
        adminid: adminId,
        action: "REJECT_REPORT",
        reportid: report.id,
      },
    })
    
    
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}