import { Container, EventList, Filters, Title } from "@/components/shared";
import React, { Suspense } from "react";

interface Props {
  className?: string;
}

export default function EventsPage() {
  return (
    <Container>
      <Title text={"Все события"} className="font-semibold" />
      <Suspense>
        <Filters className="mt-[27px]" />
      </Suspense>
      <Suspense>
        <EventList />
      </Suspense>
    </Container>
  );
}
