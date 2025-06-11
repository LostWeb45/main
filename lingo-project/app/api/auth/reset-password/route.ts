import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, code, password } = await req.json();

    if (!email || !code || !password) {
      return NextResponse.json(
        { error: "Некорректные данные" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 400 }
      );
    }

    const storedCode = await prisma.verificationCode.findFirst({
      where: { userId: user.id, code },
    });

    if (!storedCode) {
      return NextResponse.json(
        { error: "Неверный или устаревший код" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await prisma.verificationCode.deleteMany({ where: { userId: user.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
