// app/(main)/categories/search/page.tsx — серверный компонент по умолчанию (без "use client")
import React, { Suspense } from "react";
import { Container, Title } from "@/components/shared";
import { Skeleton } from "@/components/ui/skeleton";
import ClientCategorySearch from "@/components/shared/client-category-search";

export default function CategoriesPage() {
  return (
    <Container>
      <Suspense fallback={null}>
        <ClientCategorySearch />
      </Suspense>
    </Container>
  );
}
