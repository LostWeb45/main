import { NextRequest, NextResponse } from "next/server";
import { ForgotPassword } from "@/components/shared/email-templates/forgot-password";
import { sendMail } from "@/lib/sendMail";
import { prisma } from "@/prisma/prisma-client";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Неверный email" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ ok: true });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.verificationCode.deleteMany({
      where: { userId: user.id },
    });

    await prisma.verificationCode.create({
      data: {
        code,
        userId: user.id,
      },
    });

    const html = ForgotPassword
      ? ForgotPassword({ code })
      : `<p>Ваш код для сброса пароля: <strong>${code}</strong></p>`;

    await sendMail({
      to: email,
      subject: "Сброс пароля",
      text: `Код для сброса: ${code}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
