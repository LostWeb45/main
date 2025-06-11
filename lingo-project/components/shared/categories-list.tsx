"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CategoryItem } from "./category-item";
import { Skeleton } from "../ui/skeleton";
import { Category } from "@prisma/client";

interface Props {
  limit?: number;
  className?: string;
}

interface CategoryVitchCount extends Category {
  eventsCount: number;
}

export const CategoriesList: React.FC<Props> = ({ limit, className }) => {
  const [categories, setCategories] = useState<CategoryVitchCount[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const displayedCategories =
    limit && categories ? categories.slice(0, limit) : categories;

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);

      try {
        const res = await fetch("/api/categories");

        if (!res.ok) {
          throw new Error("Не удалось загрузить категории");
        }

        const data = await res.json();

        setCategories(data);
      } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5",
        className
      )}
    >
      {loading
        ? Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[105px] rounded-[1px]" />
          ))
        : displayedCategories?.map((category) => (
            <CategoryItem
              key={category.id}
              title={category.name}
              imageUrl={category.image || "/placeholder.png"}
              id={category.id}
              eventsCount={category.eventsCount}
            />
          ))}
    </div>
  );
};
