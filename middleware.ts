import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export const middleware = withAuth(
  function middleware(req) {
    // Nếu chưa đăng nhập, redirect sang login
    if (!req.nextauth.token) {
      const loginUrl = new URL("/login", req.url)
      return NextResponse.redirect(loginUrl)
    }

    // Nếu user chưa verify email và không đang ở trang verify-otp
    const isVerifyOTPPage = req.nextUrl.pathname === '/verify-otp'
    const emailVerified = req.nextauth.token.emailVerified as Date | null
    
    if (!emailVerified && !isVerifyOTPPage) {
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
      authorized: ({ token }) => {
        // Cho phép truy cập nếu có token
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
    "/verify-otp",
  ],
}
