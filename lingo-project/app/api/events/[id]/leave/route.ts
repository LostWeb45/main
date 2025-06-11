import { getServerSession } from "next-auth";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";
import { authOptions } from "@/constants/auth-options";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  await prisma.event.update({
    where: { id: parseInt(id) },
    data: {
      participants: {
        disconnect: { id: user.id },
      },
    },
  });

  return NextResponse.json({ message: "Left event successfully" });
}
