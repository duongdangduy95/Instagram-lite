import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, generateOTP, generateOTPEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { email, username } = await req.json()

    if (!email || !username) {
      return NextResponse.json(
        { error: 'Email và username là bắt buộc' },
        { status: 400 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Delete any existing OTPs for this email
    await prisma.emailOTP.deleteMany({
      where: { email }
    })

    // Save OTP to database
    await prisma.emailOTP.create({
      data: {
        email,
        otp,
        expires: otpExpiry,
        verified: false
      }
    })

    // Send OTP email
    try {
      const emailHtml = generateOTPEmail(otp, username)
      await sendEmail({
        to: email,
        subject: 'Xác thực email - Instagram Lite',
        html: emailHtml
      })

      console.log('OTP sent successfully to:', email)

      return NextResponse.json({
        message: 'Mã OTP đã được gửi đến email của bạn'
      })
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError)
      
      // Delete the OTP if email fails
      await prisma.emailOTP.deleteMany({
        where: { email }
      })

      return NextResponse.json(
        { error: 'Không thể gửi email OTP. Vui lòng thử lại sau.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại sau.' },
      { status: 500 }
    )
  }
}
