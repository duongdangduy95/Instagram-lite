import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email và OTP là bắt buộc' },
        { status: 400 }
      )
    }

    // Find the OTP record
    const otpRecord = await prisma.emailOTP.findFirst({
      where: {
        email,
        otp,
        verified: false
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Mã OTP không hợp lệ' },
        { status: 400 }
      )
    }

    // Check if OTP is expired
    if (otpRecord.expires < new Date()) {
      // Delete expired OTP
      await prisma.emailOTP.delete({
        where: { id: otpRecord.id }
      })

      return NextResponse.json(
        { error: 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.' },
        { status: 400 }
      )
    }

    // Mark OTP as verified
    await prisma.emailOTP.update({
      where: { id: otpRecord.id },
      data: { verified: true }
    })

    // Update user's emailVerified field if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (user) {
      await prisma.user.update({
        where: { email },
        data: { emailVerified: new Date() }
      })
    }

    return NextResponse.json({
      message: 'Xác thực email thành công',
      verified: true,
      user: user ? {
        email: user.email,
        username: user.username
      } : null
    })

  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại sau.' },
      { status: 500 }
    )
  }
}
