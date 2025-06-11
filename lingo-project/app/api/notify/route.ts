import { sendTelegramMessage } from "@/lib/sendTelegramMessage";
import { prisma } from "@/prisma/prisma-client";

function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const fullDate = new Date(date);
  fullDate.setHours(hours, minutes, 0, 0);
  return fullDate;
}

export async function GET() {
  const now = new Date();
  const inAnHour = new Date(now.getTime() + 60 * 60 * 1000);

  // Находим статус "Предстоящее"
  const upcomingStatus = await prisma.status.findFirst({
    where: { name: "Предстоящее" },
  });

  if (!upcomingStatus) {
    return new Response(
      JSON.stringify({ error: 'Статус "Предстоящее" не найден' }),
      { status: 500 }
    );
  }

  const events = await prisma.event.findMany({
    where: {
      archive: false,
      statusId: upcomingStatus.id,
    },
    include: {
      participants: true,
      createdBy: true,
      category: true,
    },
  });

  let notifiedCount = 0;

  for (const event of events) {
    const eventDateTime = combineDateAndTime(event.startDate, event.startTime);
    const timeDiff = Math.abs(eventDateTime.getTime() - inAnHour.getTime());

    if (timeDiff > 5 * 60 * 1000) continue;

    const message = `🔔 *Напоминание!*\nСобытие *${event.title}* начнётся в ${event.startTime}.\nКатегория: ${event.category.name}`;

    for (const user of event.participants) {
      if (user.telegramId) {
        await sendTelegramMessage(user.telegramId, message);
        notifiedCount++;
      }
    }

    const tgGroups = await prisma.telegramGroup.findMany({
      where: { eventId: event.id },
    });

    for (const group of tgGroups) {
      await sendTelegramMessage(group.telegramChatId, message);
      notifiedCount++;
    }
  }

  return Response.json({ status: "ok", notifiedCount });
}
