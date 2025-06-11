import { prisma } from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query") || "";
  const minPrice = request.nextUrl.searchParams.get("minPrice");
  const maxPrice = request.nextUrl.searchParams.get("maxPrice");
  const categoryId = request.nextUrl.searchParams.get("categoryId");
  const townId = request.nextUrl.searchParams.get("townId");
  const statusId = request.nextUrl.searchParams.get("statusId");
  const age = request.nextUrl.searchParams.get("age");
  const availableOnly =
    request.nextUrl.searchParams.get("availableOnly") === "true";
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "9");
  const offset = parseInt(request.nextUrl.searchParams.get("offset") || "0");

  const upcomingStatus = await prisma.status.findUnique({
    where: { name: "Предстоящее" },
  });

  const filters = {
    title: {
      contains: query,
      mode: "insensitive" as Prisma.QueryMode,
    },
    archive: false,
    ...(upcomingStatus ? { statusId: upcomingStatus.id } : {}),
    ...(minPrice &&
      maxPrice && {
        price: { gte: parseInt(minPrice), lte: parseInt(maxPrice) },
      }),
    ...(categoryId && { categoryId: parseInt(categoryId) }),
    ...(townId && { townId: parseInt(townId) }),
    ...(statusId && { statusId: parseInt(statusId) }),
    ...(age && { age: { lte: parseInt(age) } }),
  };

  const allMatchingEvents = await prisma.event.findMany({
    where: filters,
    orderBy: { startDate: "asc" },
    include: {
      participants: true,
      createdBy: true,
      category: true,
      town: true,
      status: true,
      images: true,
    },
    take: 100,
  });

  const availableEvents = availableOnly
    ? allMatchingEvents.filter(
        (event) =>
          !event.participantsCount ||
          event.participants.length < event.participantsCount
      )
    : allMatchingEvents;

  const paginatedEvents = availableEvents.slice(offset, offset + limit);

  return NextResponse.json({
    events: paginatedEvents,
    hasMore: offset + limit < availableEvents.length,
  });
}
