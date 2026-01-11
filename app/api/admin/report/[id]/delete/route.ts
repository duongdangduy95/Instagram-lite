export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  const { id: reportId } = await params  

  const cookieStore = await cookies()
  const token = cookieStore.get("admin_session")?.value

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const session = await prisma.adminsession.findUnique({
    where: { token }
  })
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const report = await prisma.report.findUnique({
    where: { id: reportId }  // dùng reportId
  })
  if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 })

  // Soft delete blog
  await prisma.blog.update({
    where: { id: report.blogid },
    data: { isdeleted: true }
  })

  await prisma.report.update({
    where: { id: report.id },
    data: { status: "APPROVED" }
  })

  await prisma.adminactionlog.create({
    data: {
      id: crypto.randomUUID(),
      adminid: session.adminid,
      action: "DELETE_BLOG",
      blogid: report.blogid,
      reportid: report.id
    }
  })

  return NextResponse.json({ ok: true })
}
