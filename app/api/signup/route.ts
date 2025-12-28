import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcrypt'
import { sendEmail, generateOTP, generateOTPEmail } from '@/lib/email'

const prisma = new PrismaClient()

// Supabase server client (GIỐNG blog/create)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const form = await req.formData()

    const username = form.get('username') as string
    const fullname = form.get('fullname') as string
    const email = form.get('email') as string
    const password = form.get('password') as string
    const phone = (form.get('phone') as string) || null
    const avatar = form.get('avatar')

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const exists = await prisma.user.findFirst({
      where: { OR: [{ email }] }
    })

    if (exists) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    let imageUrl: string | null = null

    // ===== Upload avatar (GIỐNG blog/create) =====
    // if (avatar instanceof File && avatar.size > 0) {
    //   const buffer = Buffer.from(await avatar.arrayBuffer())
    //   const ext = avatar.type.split('/')[1] || 'jpg'

    //   const fileName = `${username}-${Date.now()}.${ext}`

    //   const { error } = await supabase.storage
    //     .from('avatars')
    //     .upload(fileName, buffer, {
    //       contentType: avatar.type,
    //       upsert: true
    //     })

    //   if (error) {
    //     console.error('Supabase upload error:', error)
    //     return NextResponse.json(
    //       { error: 'Upload avatar failed' },
    //       { status: 500 }
    //     )
    //   }

    //   const { data } = supabase.storage
    //     .from('avatars')
    //     .getPublicUrl(fileName)

    //   imageUrl = data.publicUrl
    // }
    
    const user = await prisma.user.create({
      data: {
        username,
        fullname,
        email,
        phone,
        password: hashedPassword,
        image: imageUrl,
        emailVerified: null // Will be set after OTP verification
      }
    })

    // Send OTP for email verification
    try {
      const otp = generateOTP()
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      console.log('=== SIGNUP OTP DEBUG ===')
      console.log('Generated OTP:', otp)
      console.log('For email:', email)
      console.log('========================')

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
      const emailHtml = generateOTPEmail(otp, username)
      await sendEmail({
        to: email,
        subject: 'Xác thực email - Instagram Lite',
        html: emailHtml
      })

      console.log('OTP sent successfully to:', email)

      return NextResponse.json(
        {
          message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            image: user.image
          },
          requiresVerification: true,
          // Remove this in production
          otp: process.env.NODE_ENV === 'development' ? otp : undefined
        },
        { status: 201 }
      )
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError)
      
      // Still return success but inform user to resend OTP
      return NextResponse.json(
        {
          message: 'Đăng ký thành công! Không thể gửi email xác thực. Vui lòng yêu cầu gửi lại OTP.',
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            image: user.image
          },
          requiresVerification: true,
          emailError: true
        },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
