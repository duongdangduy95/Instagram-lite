import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST() {
  // BẮT BUỘC await
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_session")?.value

  if (token) {
    await prisma.adminsession.deleteMany({
      where: { token },
    })
  }

  // Xóa cookie
  cookieStore.set({
    name: "admin_session",
    value: "",
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  })

  return NextResponse.json({ ok: true })
}
