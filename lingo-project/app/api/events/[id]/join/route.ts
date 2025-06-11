import { authOptions } from "@/constants/auth-options";
import { prisma } from "@/prisma/prisma-client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const eventId = parseInt(id);
  if (isNaN(eventId)) {
    return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const alreadyJoined = await prisma.event.findFirst({
    where: {
      id: eventId,
      participants: {
        some: { id: user.id },
      },
    },
  });

  if (alreadyJoined) {
    return NextResponse.json({ message: "Already joined" });
  }

  await prisma.event.update({
    where: { id: eventId },
    data: {
      participants: {
        connect: { id: user.id },
      },
    },
  });

  return NextResponse.json({
    message: "Joined",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
  });
}
