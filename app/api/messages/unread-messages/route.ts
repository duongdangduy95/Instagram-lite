import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) 
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

  try {
    // Đếm tin nhắn chưa xem
    const unreadCount = await prisma.message.count({
      where: {
        senderId: { not: userId },      // tin nhắn từ người khác
        status: { in: ['SENT', 'DELIVERED'] }, // chưa xem (chưa SEEN)
        conversation: {
          participants: {
            some: { userId }            // conversation mà tôi tham gia
          }
        }
      }
    })

    return NextResponse.json({ unreadCount })
  } catch (err: unknown) {
    console.error(err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
