// app/api/admin/login/route.ts
export const runtime = "nodejs"
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { checkAdminWhitelist } from '@/lib/admin-whitelist'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password } = body
    
    // ✅ CHECK WHITELIST TRƯỚC KHI XỬ LÝ LOGIN
    const whitelistCheck = await checkAdminWhitelist(req, username)
    if (!whitelistCheck.allowed) {
      console.warn(`[Admin Login] Blocked: ${whitelistCheck.reason}`)
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }
    
    const admin = await prisma.admin.findUnique({ where: { username } })
    
    if (!admin || !admin.isactive) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    const ok = await bcrypt.compare(password, admin.password)
    
    if (!ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    const token = crypto.randomBytes(32).toString('hex')
    
    const session = await prisma.adminsession.create({
      data: {
        id: crypto.randomUUID(),
        adminid: admin.id,
        token,
        expiresat: new Date(Date.now() + 1000 * 60 * 60 * 12), // 12h
      }
    })

    
    const res = NextResponse.json({
      id: admin.id,
      username: admin.username,
      role: admin.role
    })
    
    // Set cookie
    res.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12
    })
    
    
    return res
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}