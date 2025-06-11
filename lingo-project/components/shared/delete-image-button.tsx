"use client";

export default function DeleteImageButton({
  imageId,
  eventId,
}: {
  imageId: number;
  eventId: number;
}) {
  const handleDeleteImage = async () => {
    try {
      await fetch(`/api/events/${eventId}/images/${imageId}`, {
        method: "DELETE",
      });
      console.log(
        `Удаление изображения: eventId=${eventId}, imageId=${imageId}`
      );

      window.location.reload();
    } catch (error) {
      console.error("Ошибка удаления изображения:", error);
    }
  };

  return (
    <button
      className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded"
      onClick={handleDeleteImage}
    >
      ❌
    </button>
  );
}
