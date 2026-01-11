import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminShell from "./AdminShell";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) redirect("/admin/login");

  const session = await prisma.adminsession.findUnique({
    where: { token },
    include: { admin: true },
  });

  if (!session) redirect("/admin/login");

  return (
    <AdminShell admin={{
      id: session.admin.id,
      username: session.admin.username,
    }} />
  );
}
