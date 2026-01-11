import { cookies } from "next/headers"
import { PrismaClient } from "@prisma/client"
import AdminReportItem from "./AdminReportItem"
import LogoutButton from "./LogoutButton"
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function AdminHome() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) redirect("/admin/login");

  const session = await prisma.adminsession.findUnique({
    where: { token },
    include: { admin: true },
  });
  if (!session) redirect("/admin/login");

  const reports = await prisma.report.findMany({
    where: { status: "PENDING" },
    include: {
      Blog: { include: { author: true, comments: true } },
      User: true,
    },
    orderBy: { createdat: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#0B0E11] px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-2xl font-semibold">
          Welcome {session.admin.username}
        </h1>
        <LogoutButton />
      </div>

      {/* List Reports */}
      <div className="space-y-6">
        {reports.map((r) => (
          <AdminReportItem
            key={r.id}
            reportId={r.id}
            blogCaption={r.Blog.caption}
            reporterUsername={r.User.username}
            reason={r.reason}
          />
        ))}
      </div>
    </div>
  );
}
