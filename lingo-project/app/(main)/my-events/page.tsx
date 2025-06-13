"use client";

import React from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Crown, LogOut, Plus } from "lucide-react";
import { Title } from "@/components/shared";

interface Event {
  id: number;
  title: string;
  category: { name: string };
  town: { name: string };
  images: { imageUrl: string }[];
  status: { name: string };
  createdById: string;
}

export default function MyEventsPage() {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const { data: session, status } = useSession();

  React.useEffect(() => {
    if (status === "loading") return;
    if (session) {
      fetch("/api/user/participated-events")
        .then((res) => res.json())
        .then((data) => setEvents(data));
    }
  }, [status, session, router]);

  const handleLeave = (eventId: number) => {
    startTransition(async () => {
      const res = await fetch(`/api/events/${eventId}/leave`, {
        method: "POST",
      });

      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
        toast.success("Вы вышли из события");
      } else {
        toast.error("Ошибка при выходе");
      }
    });
  };

  const upcomingEvents = events.filter(
    (event) => event.status?.name === "Предстоящее"
  );
  const pendingEvents = events.filter(
    (event) => event.status?.name === "На проверке"
  );

  const renderEventItem = (event: Event) => {
    const isCreator = event.createdById == session?.user?.id;

    const handleClick = () => {
      router.push(`/events/${event.id}`);
    };

    const handleLeaveClick = (
      e: React.MouseEvent<SVGSVGElement, MouseEvent>
    ) => {
      e.stopPropagation();
      handleLeave(event.id);
    };

    return (
      <div
        key={event.id}
        onClick={handleClick}
        className="p-5 px-7 flex justify-between transition-shadow duration-300 items-center bg-[#f5f6fa] hover:shadow-lg cursor-pointer"
      >
        <div>
          <div className="text-lg font-semibold">{event.title}</div>
          <p className="text-md text-gray-600">
            {event.town.name} · {event.category.name}
          </p>
        </div>
        {isCreator ? (
          <Crown className="text-yellow-400" width={25} />
        ) : (
          <LogOut
            className="text-red-500 cursor-pointer duration-300 hover:text-red-400 "
            width={25}
            onClick={handleLeaveClick}
          />
        )}
      </div>
    );
  };

  return (
    <div className="p-1 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <Title text="Мои события" className="font-medium" />

        <button
          onClick={() => redirect("/events/create")}
          className="flex justify-center items-center relative gap-2 border font-semibold border-[#aebdf3] rounded-[2px] cursor-pointer px-[15px] py-[6px] duration-200 hover:bg-[#e6e6f4]"
        >
          <p className="text-[#3A5F9D] text-[16px]">Создать событие</p>
          <Plus className="text-[#3A5F9D]" width={20} />
        </button>
      </div>
      <hr className="w-[90%] mx-auto my-4" />

      {events.length === 0 ||
      (upcomingEvents.length === 0 && pendingEvents.length === 0) ? (
        <h3 className="text-xl font-semibold mt-2 mb-2 ml-[5%] sm:ml-[33%] text-[#585858]">
          Вы ещё не участвуете в событиях
        </h3>
      ) : (
        <div>
          {upcomingEvents.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mt-2 mb-2 ml-[12px] text-[#585858] ">
                Предстоящие
              </h3>
              <div className="space-y-4">
                {upcomingEvents.map(renderEventItem)}
              </div>
            </div>
          )}
          {pendingEvents.length > 0 && (
            <div>
              <h3 className="text-xl text-[#585858] ml-[12px] font-semibold mt-3 mb-2 ">
                На проверке
              </h3>
              <div className="space-y-4">
                {pendingEvents.map(renderEventItem)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
