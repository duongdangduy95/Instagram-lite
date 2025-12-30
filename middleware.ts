import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export const middleware = withAuth(
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

// Áp dụng middleware cho những route này
export const config = {
  matcher: [
    "/home",
    "/blog/:path*",
    "/profile/:path*",
    "/search",
    "/user/:path*",
    "/verify-otp", // Giữ lại để xử lý logic emailVerified cho Google OAuth
  ],
}
