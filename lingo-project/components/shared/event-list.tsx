"use client";

import React from "react";
import { EventCard } from "./event-card";
import { Button, Skeleton } from "../ui";
import { cn } from "@/lib/utils";
import { useEvents } from "@/hooks/useEvents";

interface Props {
  className?: string;
}

export const EventList: React.FC<Props> = ({ className }) => {
  const { events, isLoading, error, hasMore, fetchEvents } = useEvents();

  return (
    <div className={cn("mt-[30px] w-full", className)}>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex flex-col gap-3">
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-6  w-2/5" />
              <Skeleton className="h-8  w-5/6" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-5 w-2/3" />
              </div>
              <Skeleton className="h-10  w-[150px]" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : events.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-5">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-6">
              <Button
                className="w-[180px] h-[45px] text-[16px] text-[#3A5F9D]"
                variant={"outline"}
                onClick={() => fetchEvents(false)}
              >
                Показать ещё
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-gray-500 text-center mt-6">
          Нет событий по выбранным фильтрам.
        </div>
      )}
    </div>
  );
};
