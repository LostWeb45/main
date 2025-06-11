import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/constants/auth-options";
import { prisma } from "@/prisma/prisma-client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const eventId = Number(params.id);
  const { status } = await req.json();

  if (!session?.user) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { message: "Событие не найдено" },
        { status: 404 }
      );
    }

    if (event.createdById !== Number(session.user.id)) {
      return NextResponse.json({ message: "Нет доступа" }, { status: 403 });
    }

    const newStatus = await prisma.status.findFirst({
      where: { name: status.trim() },
    });

    if (!newStatus) {
      return NextResponse.json(
        { message: "Такой статус не существует" },
        { status: 400 }
      );
    }

    await prisma.event.update({
      where: { id: eventId },
      data: { statusId: newStatus.id },
    });

    return NextResponse.json({ message: "Статус обновлён" });
  } catch (error) {
    console.error("Ошибка обновления статуса:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
