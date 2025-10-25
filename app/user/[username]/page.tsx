import { prisma } from '@/lib/prisma'

interface Props {
  params: { username: string }
}

export default async function UserProfilePage({ params }: Props) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      blogs: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!user) return <div>User not found</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">@{user.username}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {user.blogs.map(blog => (
          <div key={blog.id} className="bg-white p-4 rounded shadow">
            <img src={blog.imageUrl} alt={blog.caption} className="w-full h-48 object-cover rounded" />
            <p className="mt-2">{blog.caption}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
