import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/constants/auth-options";

// POST обработчик
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Пользователь не авторизован" },
      { status: 401 }
    );
  }

  const { avatarUrl } = await req.json();

  if (!avatarUrl) {
    return NextResponse.json(
      { error: "URL изображения не предоставлен" },
      { status: 400 }
    );
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(session.user.id) },
      data: { image: avatarUrl },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Ошибка при обновлении аватара:", error);
    return NextResponse.json(
      { error: "Не удалось обновить аватар" },
      { status: 500 }
    );
  }
}
