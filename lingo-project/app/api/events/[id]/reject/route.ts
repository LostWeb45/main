import { authOptions } from "@/constants/auth-options";
import { prisma } from "@/prisma/prisma-client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const eventId = parseInt(params.id);
  const rejectedStatus = await prisma.status.findFirstOrThrow({
    where: { name: "Отмененное" },
  });

  await prisma.event.update({
    where: { id: eventId },
    data: {
      statusId: rejectedStatus.id,
    },
  });

  return NextResponse.redirect(new URL("/admin/events", req.url));
}
