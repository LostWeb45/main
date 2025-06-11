import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { chatId } = await req.json();

    if (!chatId) {
      return NextResponse.json(
        { error: "chatId is required" },
        { status: 400 }
      );
    }

    const group = await prisma.telegramGroup.findUnique({
      where: { telegramChatId: String(chatId) },
    });

    if (!group || !group.eventId) {
      return NextResponse.json(
        { error: "Event not found for this group" },
        { status: 404 }
      );
    }

    return NextResponse.json({ eventId: group.eventId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
