import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(req: NextRequest) {
  try {
    const { token, email, password } = await req.json()

    if (!token || !email || !password) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      )
    }

    // Find the reset token
    const resetToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: token
      }
    })

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (resetToken.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: email,
            token: token
          }
        }
      })
      return NextResponse.json(
        { error: 'Link đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu link mới.' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Người dùng không tồn tại' },
        { status: 404 }
      )
    }

    // Check if user is OAuth user
    if (!user.password) {
      return NextResponse.json(
        { error: 'Tài khoản này đăng nhập bằng Google. Không thể đặt lại mật khẩu.' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update user password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    })

    // Delete used token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: token
        }
      }
    })

    return NextResponse.json({
      message: 'Đặt lại mật khẩu thành công'
    })

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại sau.' },
      { status: 500 }
    )
  }
}
