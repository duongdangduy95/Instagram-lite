// lib/admin-whitelist.ts
import { NextRequest } from 'next/server'

/**
 * Lấy client IP từ request
 * Hỗ trợ các header phổ biến: x-forwarded-for, x-real-ip, cf-connecting-ip
 */
export function getClientIP(req: NextRequest): string | null {
  // 1. X-Forwarded-For (phổ biến nhất khi có proxy/load balancer)
  // Format: "client_ip, proxy1_ip, proxy2_ip"
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    // Lấy IP đầu tiên (client IP thật)
    return forwarded.split(',')[0].trim()
  }
  
  // 2. X-Real-IP (Nginx proxy)
  const realIP = req.headers.get('x-real-ip')
  if (realIP) return realIP.trim()
  
  // 3. CF-Connecting-IP (Cloudflare)
  const cfIP = req.headers.get('cf-connecting-ip')
  if (cfIP) return cfIP.trim()
  
  // 4. X-Client-IP (một số proxy khác)
  const clientIP = req.headers.get('x-client-ip')
  if (clientIP) return clientIP.trim()
  
  return null
}

/**
 * Kiểm tra IP có trong whitelist không
 * @param req NextRequest object
 * @returns true nếu IP được phép, false nếu không
 */
export function isIPWhitelisted(req: NextRequest): boolean {
  // ✅ AN TOÀN: Nếu env chưa set → default = "*" (cho phép tất cả)
  // Không bao giờ throw error, luôn có giá trị
  const whitelistStr = process.env.ADMIN_IP_WHITELIST || '*'
  
  // Nếu là "*" hoặc rỗng → cho phép tất cả (disable whitelist)
  if (whitelistStr === '*' || whitelistStr.trim() === '') {
    return true
  }
  
  // Parse danh sách IP (format: "1.2.3.4,5.6.7.8")
  const whitelist = whitelistStr
    .split(',')
    .map(ip => ip.trim())
    .filter(ip => ip.length > 0)
  
  const clientIP = getClientIP(req)
  
  // Nếu không lấy được IP
  if (!clientIP) {
    // Nếu whitelist đã được config (không phải "*") → chặn
    // Nếu chưa config → cho phép (an toàn hơn)
    // Trong development luôn cho phép
    return whitelistStr === '*' || process.env.NODE_ENV === 'development'
  }
  
  // Check IP có trong whitelist không
  return whitelist.includes(clientIP)
}

/**
 * Kiểm tra username admin có trong whitelist không
 * @param username Username của admin
 * @returns true nếu username được phép, false nếu không
 */
export async function isAdminWhitelisted(username: string): Promise<boolean> {
  // ✅ AN TOÀN: Default = "*" nếu env chưa set
  const whitelistStr = process.env.ADMIN_USERNAME_WHITELIST || '*'
  
  // Nếu là "*" hoặc rỗng → cho phép tất cả
  if (whitelistStr === '*' || whitelistStr.trim() === '') {
    return true
  }
  
  // Parse danh sách username (format: "admin1,admin2")
  const whitelist = whitelistStr
    .split(',')
    .map(u => u.trim())
    .filter(u => u.length > 0)
  
  return whitelist.includes(username)
}

/**
 * Kiểm tra request có được phép truy cập admin API không
 * @param req NextRequest object
 * @param username Optional username để check username whitelist
 * @returns Object với allowed: boolean và reason?: string
 */
export async function checkAdminWhitelist(
  req: NextRequest,
  username?: string
): Promise<{ allowed: boolean; reason?: string }> {
  try {
    // Check IP whitelist
    const ipAllowed = isIPWhitelisted(req)
    if (!ipAllowed) {
      const clientIP = getClientIP(req) || 'unknown'
      return {
        allowed: false,
        reason: `IP ${clientIP} is not whitelisted`
      }
    }
    
    // Check username whitelist (nếu có username)
    if (username) {
      const userAllowed = await isAdminWhitelisted(username)
      if (!userAllowed) {
        return {
          allowed: false,
          reason: `Admin username "${username}" is not whitelisted`
        }
      }
    }
    
    return { allowed: true }
  } catch (error) {
    // ✅ AN TOÀN: Nếu có lỗi bất kỳ → log và cho phép (fail-open)
    // Để tránh block user khi có bug
    console.error('[Admin Whitelist] Error checking whitelist:', error)
    return { allowed: true } // Fail-open: cho phép khi có lỗi
  }
}
