import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Ghi chú: Socket.IO kiểu pages/api (res.socket.server) không chạy trong App Router route handlers.
// Project này đã có websocket/real-time theo hướng khác (vd `socket-server.js`, `/api/ws`).
// Endpoint này giữ lại để tránh 404 nếu client có fetch "warm up".
export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Socket endpoint (noop in App Router). Use external socket server instead.',
  })
}
