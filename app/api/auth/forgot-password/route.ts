import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { sendEmail, generatePasswordResetEmail } from '@/lib/email'

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
    const resetLink = `https://instagram-lite.vercel.app/reset-password?token=${resetToken}&email=${email}`
    
    console.log('Password Reset Link:', resetLink)
    
    // Send email with reset link
    try {
      const emailHtml = generatePasswordResetEmail(resetLink, user.username)
      await sendEmail({
        to: email,
        subject: 'Đặt lại mật khẩu - Instagram Lite',
        html: emailHtml
      })
      
      console.log('Password reset email sent successfully to:', email)
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError)
      // Delete the token if email fails
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: email,
            token: resetToken
          }
        }
      })
      return NextResponse.json(
        { error: 'Không thể gửi email. Vui lòng kiểm tra cấu hình email hoặc thử lại sau.' },
        { status: 500 }
      )
    }

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
