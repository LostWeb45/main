import { sendTelegramMessage } from "@/lib/sendTelegramMessage";
import { prisma } from "@/prisma/prisma-client";

function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const fullDate = new Date(date);
  fullDate.setHours(hours + 3, minutes, 0, 0); 
  return fullDate;
}

export async function GET() {
  const now = new Date(new Date().getTime() + 3 * 60 * 60 * 1000); // UTC+3 для СПБ


  const inAnHour = new Date(now.getTime() + 60 * 60 * 1000);

  // Устанавливаем окно ±30 минут от inAnHour
  const startWindow = new Date(inAnHour.getTime() - 30 * 60 * 1000);
  const endWindow = new Date(inAnHour.getTime() + 30 * 60 * 1000);

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

    // Проверяем попадание события в заданное окно
    if (eventDateTime < startWindow || eventDateTime > endWindow) continue;

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
