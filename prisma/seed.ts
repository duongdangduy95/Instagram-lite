import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Tạo user mẫu
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      username: 'demo_user',
      fullname: 'Demo User',
      email: 'demo@example.com',
      phone: '0123456789',
      password: hashedPassword,
    },
  });

  console.log('✅ Created user:', user.email);

  // Tạo blog posts mẫu
  const blogs = [
    {
      caption: 'Chào mừng đến với Instagram Lite! Đây là bài viết đầu tiên của tôi 🎉',
      imageUrl: '/uploads/1748519547943-Screenshot 2025-04-23 212516 - Copy.png',
      authorId: user.id,
    },
    {
      caption: 'Hôm nay là một ngày đẹp trời! Share với mọi người nhé 😊',
      imageUrl: '/uploads/1748519615398-Screenshot 2025-04-23 212348.png',
      authorId: user.id,
    },
    {
      caption: 'Check out this amazing sunset! 🌅',
      imageUrl: '/uploads/1748520099101-Screenshot 2025-04-23 223640.png',
      authorId: user.id,
    },
  ];

  for (const blog of blogs) {
    const created = await prisma.blog.create({
      data: blog,
    });
    console.log('✅ Created blog:', created.id);
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

