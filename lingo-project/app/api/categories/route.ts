import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            events: {
              where: {
                status: {
                  name: "Предстоящее",
                },
              },
            },
          },
        },
      },
    });

    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      image: category.image,
      eventsCount: category._count.events,
    }));

    const filteredCategories = formattedCategories.filter(
      (category) => category.eventsCount > 0
    );

    return NextResponse.json(filteredCategories);
  } catch (error) {
    console.error("Ошибка загрузки категорий:", error);
    return NextResponse.json(
      { error: "Ошибка загрузки категорий" },
      { status: 500 }
    );
  }
}
