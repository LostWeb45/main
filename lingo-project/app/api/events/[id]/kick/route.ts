import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/constants/auth-options";
import { prisma } from "@/prisma/prisma-client";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  const currentUserEmail = session.user.email;
  const eventId = parseInt(id);
  const userIdParam = req.nextUrl.searchParams.get("userId");

  if (!userIdParam) {
    return NextResponse.json(
      { message: "Не указан ID пользователя" },
      { status: 400 }
    );
  }

  const userId = parseInt(userIdParam);

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { createdBy: true },
  });

  if (!event) {
    return NextResponse.json(
      { message: "Событие не найдено" },
      { status: 404 }
    );
  }

  if (event.createdBy.email !== currentUserEmail) {
    return NextResponse.json(
      { message: "Нет прав для удаления участников" },
      { status: 403 }
    );
  }

  await prisma.event.update({
    where: { id: eventId },
    data: {
      participants: {
        disconnect: { id: userId },
      },
    },
  });

  return NextResponse.json({ message: "Участник удален" }, { status: 200 });
}
