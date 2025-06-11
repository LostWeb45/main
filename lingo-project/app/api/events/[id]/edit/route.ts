import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/constants/auth-options";
import { prisma } from "@/prisma/prisma-client";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const params = await context.params;
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const startDateStr = formData.get("startDate") as string;
    const startTime = formData.get("startTime") as string;
    const durationStr = formData.get("duration") as string;
    const priceStr = formData.get("price") as string | null;
    const ageStr = formData.get("age") as string | null;
    const place = formData.get("place") as string | null;
    const categoryIdStr = formData.get("categoryId") as string;
    const townIdStr = formData.get("townId") as string;
    const statusIdStr = formData.get("statusId") as string | null;
    const participantsCountStr = formData.get("participantsCount") as
      | string
      | null;

    const updated = await prisma.event.update({
      where: { id: parseInt(params.id) },
      data: {
        title,
        description,
        startDate: new Date(startDateStr),
        startTime,
        duration: parseInt(durationStr),
        price: priceStr ? parseFloat(priceStr) : null,
        age: ageStr ? parseInt(ageStr) : 0,
        place: place || "",
        categoryId: parseInt(categoryIdStr),
        townId: parseInt(townIdStr),
        statusId: statusIdStr ? parseInt(statusIdStr) : undefined,
        participantsCount: participantsCountStr
          ? parseInt(participantsCountStr)
          : undefined,
      },
    });

    const url = new URL(
      `/admin/events/${params.id}/edit`,
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    );
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Ошибка обновления события:", error);
    console.error("Ошибка обновления события:", error);
    return NextResponse.json(
      {
        error: "Ошибка при обновлении события",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
