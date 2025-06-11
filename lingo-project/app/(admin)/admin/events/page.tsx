import { prisma } from "@/prisma/prisma-client";
import Link from "next/link";
import { Container, Title } from "@/components/shared";
import { getServerSession } from "next-auth";
import { authOptions } from "@/constants/auth-options";
import { redirect } from "next/navigation";
import { Check, X } from "lucide-react";

export default async function PendingEventsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const pendingEvents = await prisma.event.findMany({
    where: {
      status: {
        name: "На проверке",
      },
    },
    include: {
      town: true,
      category: true,
    },
  });

  return (
    <Container className="space-y-6">
      <Title text="События на проверке" />
      {pendingEvents.length === 0 ? (
        <p>Нет событий на проверке.</p>
      ) : (
        <div className="space-y-4">
          {pendingEvents.map((event) => (
            <div
              key={event.id}
              className="flex justify-between items-center border p-4 rounded"
            >
              <div>
                <h3 className="text-xl font-bold">{event.title}</h3>
                <p>
                  {event.category.name} — {event.town.name}
                </p>

                <div className="flex gap-4 mt-4">
                  <Link
                    href={`/events/${event.id}`}
                    className="text-blue-600 underline"
                  >
                    Посмотреть
                  </Link>
                  <Link
                    href={`/admin/events/${event.id}/edit`}
                    className="text-yellow-600 underline"
                  >
                    Редактировать
                  </Link>
                </div>
              </div>
              <div className="flex gap-4 ">
                <form action={`/api/events/${event.id}/approve`} method="POST">
                  <button
                    type="submit"
                    className="border w-[60px] h-[60px] cursor-pointer border-green-600 hover:bg-green-100 font-semibold px-4  rounded"
                  >
                    <Check className="text-green-600" size={25} />
                  </button>
                </form>
                <form action={`/api/events/${event.id}/reject`} method="POST">
                  <button
                    type="submit"
                    className="border w-[60px] h-[60px] cursor-pointer border-red-600 hover:bg-red-100 font-semibold px-4  rounded"
                  >
                    <X className="text-red-600" size={25} />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
