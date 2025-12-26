import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcrypt'

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
        image: imageUrl
      }
    })

    return NextResponse.json(
      {
        message: 'Signup successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          image: user.image
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
