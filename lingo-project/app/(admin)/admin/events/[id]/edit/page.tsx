import { prisma } from "@/prisma/prisma-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/constants/auth-options";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { Container, Title } from "@/components/shared";
import DeleteImageButton from "@/components/shared/delete-image-button";

export default async function EditEventPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const event = await prisma.event.findUnique({
    where: { id: parseInt(id) },
    include: {
      category: true,
      town: true,
      status: true,
      images: true,
    },
  });

  const categories = await prisma.category.findMany();
  const towns = await prisma.town.findMany();

  if (!event) notFound();

  const handleDeleteImage = async (imageId: number) => {
    try {
      await fetch(`/api/events/${event.id}/images/${imageId}/delete`, {
        method: "DELETE",
      });

      // Обновляем страницу после удаления
      window.location.reload();
    } catch (error) {
      console.error("Ошибка удаления изображения:", error);
    }
  };

  return (
    <Container className="space-y-6">
      <Title text={`Редактирование: ${event.title}`} />

      {event.images.map((image) => (
        <div key={image.id} className="relative inline-block">
          <img
            src={`http://82.202.128.170/${image.imageUrl}`}
            alt=""
            className="w-40 h-40 object-cover"
          />
          <DeleteImageButton imageId={image.id} eventId={event.id} />
        </div>
      ))}

      <form
        action={`/api/events/${event.id}/edit`}
        method="POST"
        className="space-y-4"
      >
        <input type="hidden" name="id" value={event.id} />

        <div>
          <label className="block font-medium">Название</label>
          <input
            name="title"
            defaultValue={event.title}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Описание</label>
          <textarea
            name="description"
            defaultValue={event.description}
            className="w-full border rounded px-3 py-2"
            rows={6}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Место</label>
          <input
            name="place"
            defaultValue={event.place}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Дата начала</label>
            <input
              type="date"
              name="startDate"
              defaultValue={event.startDate.toISOString().split("T")[0]}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Время начала</label>
            <input
              type="time"
              name="startTime"
              defaultValue={event.startTime}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Продолжительность (мин.)</label>
          <input
            type="number"
            name="duration"
            defaultValue={event.duration}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Возрастное ограничение</label>
          <input
            type="number"
            name="age"
            defaultValue={event.age}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Категория</label>
          <select
            name="categoryId"
            defaultValue={event.category.id}
            className="w-full border rounded px-3 py-2"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Город</label>
          <select
            name="townId"
            defaultValue={event.town.id}
            className="w-full border rounded px-3 py-2"
          >
            {towns.map((town) => (
              <option key={town.id} value={town.id}>
                {town.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Сохранить изменения
        </button>
      </form>
    </Container>
  );
}
