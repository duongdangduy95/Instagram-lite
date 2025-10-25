import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const { username, fullname, email, phone, password } = body;

  if (!username || !email || !password) {
    return Response.json({ message: "Missing required fields" }, { status: 400 });
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
       
      ]
    }
  });

  if (existingUser) {
    return Response.json(
      { message: "User with same email or username already exists" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      fullname,
      email,
      phone,
      password: hashedPassword
    }
  });

  return Response.json({ message: "User created", user: { id: user.id, email: user.email } });
}
