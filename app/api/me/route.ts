import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = (await cookies()).get('session')?.value
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [userId] = session.split(':')

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      blogs: {
        include: {
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
          likes: {
            select: {
              userId: true,
            },
          },
          author: {
            select: {
              id: true,
              fullname: true,
              username: true,
            }
          },
          // ĐÂY LÀ PHẦN QUAN TRỌNG - lấy thông tin bài gốc nếu là bài share
          sharedFrom: {
            include: {
              author: {
                select: {
                  id: true,
                  fullname: true,
                  username: true,
                }
              },
              _count: {
                select: {
                  likes: true,
                  comments: true,
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      likes: {
        include: {
          blog: {
            include: {
              _count: {
                select: {
                  likes: true,
                  comments: true,
                },
              },
              likes: {
                select: {
                  userId: true,
                },
              },
              author: {
                select: {
                  id: true,
                  fullname: true,
                  username: true,
                }
              },
              sharedFrom: {
                include: {
                  author: {
                    select: {
                      id: true,
                      fullname: true,
                      username: true,
                    }
                  },
                  _count: {
                    select: {
                      likes: true,
                      comments: true,
                    }
                  }
                }
              }
            },
          },
        },
      },
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json(user)
}