"use client";

import React from "react";
import { Avatar, Button } from "../ui";
import { AvatarFallback, AvatarImage } from "../ui/avatar";
import { Event, EventImage, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { getFormattedDateTime } from "@/lib";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { ParticipantsList } from "./part-list";

interface EventCardProps {
  event: Event & {
    images: EventImage[];
    createdBy: User;
    participants: User[];
  };
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { data: session } = useSession();
  const [joining, startTransition] = React.useTransition();
  const [participants, setParticipants] = React.useState<User[]>(
    event.participants
  );
  const participantsCount = participants.length;

  const joined = React.useMemo(() => {
    if (!session?.user) return false;
    return participants.some((p) => p.id === Number(session.user.id));
  }, [session, participants]);

  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/events/${event.id}`);
  };

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!session) {
      toast.error("Сначала войдите в аккаунт");
      return;
    }

    const newParticipant: User = {
      id: Number(session.user.id),
      name: session.user.name ?? "Без имени",
      image: session.user.image ?? null,
      telegramId: "",
      email: "",
      password: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: null,
      role: "USER",
    };

    setParticipants((prev) => [...prev, newParticipant]);

    startTransition(async () => {
      const res = await fetch(`/api/events/${event.id}/join`, {
        method: "POST",
      });

      if (!res.ok) {
        toast.error("Ошибка при вступлении");
        setParticipants((prev) =>
          prev.filter((p) => p.id !== Number(session.user.id))
        );
      } else {
        toast.success("Вы успешно вступили");
      }
    });
  };

  return (
    <div
      className="transition-shadow duration-300 hover:shadow-lg cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="h-[200px] overflow-hidden">
        <img
          src={
            event.images?.length > 0
              ? `http://82.202.128.170:4000${event.images[0]?.imageUrl}`
              : "/images/no-image.png"
          }
          alt="event image"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col gap-[10px] bg-[#F5F6FA] p-[10px]">
        <div className="flex items-center justify-between">
          <div className="flex justify-center items-center gap-3">
            <Avatar className="cursor-pointer w-[30px] h-[30px] hover:opacity-90 transition-opacity ">
              <AvatarImage
                className="w-full h-full object-cover"
                src={event.createdBy?.image ?? undefined}
              />
              <AvatarFallback className="bg-[#fcfcfc]">
                {event.createdBy.name?.charAt(0) ?? "П"}
              </AvatarFallback>
            </Avatar>
            <p className="text-[#2E1A1A] text-[13px] hover:text-[#3A5F9D] transition-colors">
              {event.createdBy.name?.split(" ")[0]}
            </p>
          </div>
          <div>{event.age}+</div>
        </div>

        <h3 className="text-[19px] font-semibold">{event.title}</h3>
        <div className="flex flex-col text-sm">
          <div>
            Адрес: <span>{event.place}</span>
          </div>
          <div>
            Дата и время:{" "}
            {getFormattedDateTime(
              new Date(event.startDate),
              event.startTime,
              event.duration
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          {participantsCount >= event.participantsCount ? (
            <Button
              className="w-[150px] h-[42px] text-[14px] opacity-50 cursor-not-allowed"
              disabled
            >
              Места кончились
            </Button>
          ) : (
            <Button
              className={`w-[150px] h-[42px] text-[14px] ${
                joined ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleJoin}
              disabled={joined || joining}
              loading={joining}
            >
              {event.price
                ? `${event.price}₽`
                : joined
                ? "Вы участвуете"
                : "Вступить"}
            </Button>
          )}
          <ParticipantsList
            participants={participants}
            maxParticipants={event.participantsCount}
          />
        </div>
      </div>
    </div>
  );
};
