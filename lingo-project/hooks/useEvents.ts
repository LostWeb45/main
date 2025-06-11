import { Event, EventImage, User } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import React from "react";

const PAGE_SIZE = 18;

interface EventWithInfo extends Event {
  images: EventImage[];
  createdBy: User;
  participants: User[];
}

export const useEvents = () => {
  const searchParams = useSearchParams();
  const [events, setEvents] = React.useState<EventWithInfo[]>([]);
  const [offset, setOffset] = React.useState<number>(0);
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchEvents = async (reset = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams(searchParams.toString());
      query.set("limit", PAGE_SIZE.toString());
      query.set("offset", reset ? "0" : offset.toString());
      query.set("availableOnly", "true");

      const response = await fetch(`/api/events/search?${query.toString()}`);
      if (!response.ok) throw new Error("Ошибка загрузки событий");

      const { events: newEvents, hasMore: newHasMore } = await response.json();

      setEvents(reset ? newEvents : [...events, ...newEvents]);
      setOffset(reset ? PAGE_SIZE : offset + PAGE_SIZE);
      setHasMore(newEvents.length === PAGE_SIZE && newHasMore);
    } catch {
      setError("Произошла ошибка при загрузке событий");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    setOffset(0);
    setHasMore(true);
    fetchEvents(true);
  }, [searchParams]);

  return { events, isLoading, error, fetchEvents, hasMore };
};
