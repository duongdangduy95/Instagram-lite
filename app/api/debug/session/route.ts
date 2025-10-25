import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const session = await getServerSession({ req, ...authOptions })
  return NextResponse.json(session)
  console.log("SESSION", session);

}
