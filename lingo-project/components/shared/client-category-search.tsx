"use client";
import React, { Suspense } from "react";
import { Container, EventList, Filters, Title } from "@/components/shared";
import { Category } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientCategorySearch() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [categoryName, setCategoryName] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    setLoading(true);
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: Category[]) => {
        setCategories(data);
        const found = data.find((c) => String(c.id) === categoryId);
        setCategoryName(found ? found.name : "все категории");
      })
      .catch((err) => {
        console.error("Ошибка при загрузке категорий:", err);
        setCategoryName("все категории");
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

  return (
    <Container>
      {loading ? (
        <Skeleton className="h-[48px] w-[500px] rounded-md mb-4" />
      ) : (
        <Title
          text={`Все события по теме ${categoryName}`}
          className="font-semibold"
        />
      )}

      <Filters className="mt-[27px]" />
      <EventList />
    </Container>
  );
}
