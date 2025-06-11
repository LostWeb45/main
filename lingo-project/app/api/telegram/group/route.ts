import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { chatId, eventId, title } = await req.json();

    const saved = await prisma.telegramGroup.upsert({
      where: { telegramChatId: String(chatId) },
      update: { eventId },
      create: {
        telegramChatId: String(chatId),
        eventId,
        name: title || "",
      },
    });

    return NextResponse.json({ success: true, saved });
  } catch (error) {
    console.error("Ошибка сохранения группы:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
