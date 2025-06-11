import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const towns = await prisma.town.findMany();

    return NextResponse.json(towns);
  } catch (err) {
    console.error("Ошибка получения списка городов:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
