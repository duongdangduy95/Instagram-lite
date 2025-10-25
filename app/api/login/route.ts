// app/api/login/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { usernameOrEmail, password } = await req.json()

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

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const sessionToken = `${user.id}:${Date.now()}`

  const res = NextResponse.json({
    message: 'Login successful',
    user: {
      id: user.id,
      username: user.username,
    },
  })

  res.cookies.set('session', sessionToken, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 1 day
  })

  return res
}
