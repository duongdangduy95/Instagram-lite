import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email là bắt buộc' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Always return success message (security practice - don't reveal if email exists)
    if (!user) {
      return NextResponse.json({
        message: 'Nếu email tồn tại, link đặt lại mật khẩu đã được gửi'
      })
    }

    // Check if user has a password (not OAuth user)
    if (!user.password) {
      return NextResponse.json({
        error: 'Tài khoản này đăng nhập bằng Google. Không thể đặt lại mật khẩu.'
      }, { status: 400 })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    // Save token to database
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: resetToken,
        expires: resetTokenExpiry
      }
    })

    // In production, you would send an email here
    // For now, we'll just return the reset link
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&email=${email}`
    
    console.log('Password Reset Link:', resetLink)
    
    // TODO: Send email with reset link
    // await sendPasswordResetEmail(email, resetLink)

    return NextResponse.json({
      message: 'Link đặt lại mật khẩu đã được gửi đến email của bạn',
      // Remove this in production - only for development
      resetLink: process.env.NODE_ENV === 'development' ? resetLink : undefined
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại sau.' },
      { status: 500 }
    )
  }
}
