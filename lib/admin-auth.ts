// lib/admin-auth.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { checkAdminWhitelist } from './admin-whitelist'

export interface AdminSession {
  adminId: string
  username: string
  role: string
}

/**
 * Verify admin session và check whitelist
 * @param req NextRequest object
 * @returns Object với authorized: boolean, session?: AdminSession, response?: NextResponse
 */
export async function verifyAdminSession(req: NextRequest): Promise<{
  authorized: boolean
  session?: AdminSession
  response?: NextResponse
}> {
  try {
    // Check whitelist IP trước
    const ipCheck = await checkAdminWhitelist(req)
    if (!ipCheck.allowed) {
      console.warn(`[Admin API] Blocked IP: ${ipCheck.reason}`)
      return {
        authorized: false,
        response: NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        )
      }
    }
    
    // Check session
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_session')?.value
    
    if (!token) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }
    
    const session = await prisma.adminsession.findUnique({
      where: { token },
      include: { admin: true },
    })
    
    if (!session || new Date() > session.expiresat) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }
    
    // Check username whitelist
    const usernameCheck = await checkAdminWhitelist(req, session.admin.username)
    if (!usernameCheck.allowed) {
      console.warn(`[Admin API] Blocked username: ${usernameCheck.reason}`)
      return {
        authorized: false,
        response: NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        )
      }
    }
    
    return {
      authorized: true,
      session: {
        adminId: session.adminid,
        username: session.admin.username,
        role: session.admin.role,
      }
    }
  } catch (error) {
    // ✅ AN TOÀN: Nếu có lỗi → log và return unauthorized
    console.error('[Admin Auth] Error verifying session:', error)
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}
