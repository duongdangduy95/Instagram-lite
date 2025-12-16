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

export async function PATCH(req: Request) {
  const cookieStore = await cookies()
  const session = (await cookieStore).get('session')?.value

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [userId] = session.split(':')
  const { fullname, email, phone } = await req.json()

  try {
    // Kiểm tra email đã tồn tại không (nếu thay đổi)
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })
      
      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json(
          { error: 'Email đã được sử dụng' },
          { status: 409 }
        )
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullname && { fullname }),
        ...(email && { email }),
        ...(phone && { phone }),
      },
      include: {
        blogs: { orderBy: { createdAt: 'desc' } },
        likes: {
          include: {
            blog: {
              include: {
                author: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
