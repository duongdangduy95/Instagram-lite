import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export const middleware = withAuth(
  function middleware(req) {
    // Nếu chưa đăng nhập, redirect sang login
    if (!req.nextauth.token) {
      const loginUrl = new URL("/login", req.url)
      return NextResponse.redirect(loginUrl)
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
    "/settings/:path*",
    "/search",
    "/user/:path*",
  ],
}
