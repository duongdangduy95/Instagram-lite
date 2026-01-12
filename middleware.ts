import { withAuth, type NextRequestWithAuth } from "next-auth/middleware"
import { NextFetchEvent, NextRequest, NextResponse } from "next/server"

function adminGate(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('admin_session')?.value

  if (!pathname.startsWith('/admin')) return null

  // Chưa login
  if (!token) {
    if (pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    return NextResponse.next() // đang ở login page, token null → cho qua
  }

  // Đã login mà vào login page → redirect /admin
  if (token && pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return NextResponse.next()
}



const userAuth = withAuth(
  function middleware(req) {
    const isVerifyOTPPage = req.nextUrl.pathname === '/verify-otp'
    
    // Cho phép truy cập /verify-otp mà không cần token (cho người dùng mới đăng ký)
    if (isVerifyOTPPage) {
      return NextResponse.next()
    }

    // Nếu chưa đăng nhập, redirect sang login
    if (!req.nextauth.token) {
      const loginUrl = new URL("/login", req.url)
      return NextResponse.redirect(loginUrl)
    }

    // Nếu user chưa verify email
    const emailVerified = req.nextauth.token.emailVerified as Date | null
    
    if (!emailVerified) {
      const email = req.nextauth.token.email
      const username = req.nextauth.token.username || req.nextauth.token.name || 'User'
      const verifyUrl = new URL("/verify-otp", req.url)
      verifyUrl.searchParams.set('email', email as string)
      verifyUrl.searchParams.set('username', username as string)
      return NextResponse.redirect(verifyUrl)
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Cho phép access verify-otp page mà không cần đăng nhập
        if (req.nextUrl.pathname === '/verify-otp') {
          return true
        }
        // Các page khác cần có token
        return !!token
      },
    },
  }
)

export function middleware(req: NextRequest, event: NextFetchEvent) {
  // Nếu là admin → xử lý bằng cookie
  const admin = adminGate(req)
  if (admin) return admin

  // Nếu không phải admin → chạy NextAuth
  return userAuth(req as NextRequestWithAuth, event)
}


// Áp dụng middleware cho những route này
export const config = {
  matcher: [
    "/home",
    "/blog/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/search",
    "/user/:path*",
    "/verify-otp", // Giữ lại để xử lý logic emailVerified cho Google OAuth
    "/admin/:path*",
  ],
}
