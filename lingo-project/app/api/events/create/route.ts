import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/constants/auth-options";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Неавторизованный доступ" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();

    const {
      title,
      description,
      startDate,
      startTime,
      duration,
      price,
      place,
      age,
      categoryId,
      townId,
      imageUrls,
      participantsCount,
    } = body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        startTime,
        duration: Number(duration),
        price: Number(price) || 0,
        place,
        age: Number(age),
        categoryId: Number(categoryId),
        townId: Number(townId),
        participantsCount: Number(participantsCount),
        createdById: Number(userId),
        statusId: 5,
        participants: {
          connect: { id: Number(userId) },
        },
      },
    });

    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
      await prisma.eventImage.createMany({
        data: imageUrls.map((url: string) => ({
          imageUrl: url,
          eventId: event.id,
        })),
      });
    }

    return NextResponse.json({ success: true, event });
  } catch (err) {
    console.error("Ошибка создания события:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
