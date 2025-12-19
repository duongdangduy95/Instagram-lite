// app/api/login/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { usernameOrEmail, password } = await req.json()

    // Tìm user theo username hoặc email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: usernameOrEmail },
          { email: usernameOrEmail },
        ],
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Kiểm tra password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // ✅ Lưu userId thật từ database vào session cookie
    const sessionToken = `${user.id}:${Date.now()}`

    // Tạo response kèm cookie session
    const res = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
      },
    })

    // Cookie tồn tại 1 ngày
    res.cookies.set('session', sessionToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 ngày
    })

    return res
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
