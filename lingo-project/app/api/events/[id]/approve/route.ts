import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/constants/auth-options";
import { prisma } from "@/prisma/prisma-client";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const approvedStatus = await prisma.status.findFirst({
    where: { name: "Предстоящее" },
  });

  if (!approvedStatus) {
    return NextResponse.json({ error: "Status not found" }, { status: 500 });
  }

  await prisma.event.update({
    where: { id: parseInt(id) },
    data: {
      statusId: approvedStatus.id,
    },
  });

  return NextResponse.redirect("http://82.202.128.170:3000/admin/events");
}
