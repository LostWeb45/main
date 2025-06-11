import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/constants/auth-options";
import { prisma } from "@/prisma/prisma-client";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string; imageId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const { id, imageId } = await context.params;

    const eventId = parseInt(id);
    const imgId = parseInt(imageId);

    const image = await prisma.eventImage.findUnique({
      where: { id: imgId },
    });

    if (!image || image.eventId !== eventId) {
      return NextResponse.json(
        { error: "Image not found or mismatch" },
        { status: 404 }
      );
    }

    await prisma.eventImage.delete({
      where: { id: imgId },
    });

    return NextResponse.json({ message: "Image deleted" }, { status: 200 });
  } catch (error) {
    console.error("Ошибка удаления изображения:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении изображения" },
      { status: 500 }
    );
  }
}
