import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/constants/auth-options";
import { prisma } from "@/prisma/prisma-client";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { telegramId } = body;

    if (!telegramId || typeof telegramId !== "string") {
      return NextResponse.json(
        { error: "Invalid telegramId" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: { telegramId },
    });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Error saving telegramId:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
