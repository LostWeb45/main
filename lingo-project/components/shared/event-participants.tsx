"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Avatar, Button } from "../ui";
import { AvatarFallback, AvatarImage } from "../ui/avatar";
import { Crown, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";

interface Props {
  eventId: number;
  initialParticipants: User[];
  createdBy: User;
  participantsCount: number;
  className?: string;
}

export const EventParticipants: React.FC<Props> = ({
  eventId,
  initialParticipants,
  className,
  createdBy,
  participantsCount,
}) => {
  const { data: session } = useSession();
  const currentUser = session?.user as User | undefined;
  const [participants, setParticipants] =
    React.useState<User[]>(initialParticipants);
  const [isPending, startTransition] = React.useTransition();

  const [kickUser, setKickUser] = React.useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  if (!currentUser) {
    return (
      <p className="mt-[50px] text-[18px] text-[#1D3C6A] [font-family:var(--font-montserrat)] font-medium opacity-70">
        Для просмотра и участия пройдите регистрацию
      </p>
    );
  }

  const isJoined = participants.some((p) => p.email === currentUser.email);

  const handleJoin = async () => {
    startTransition(async () => {
      const res = await fetch(`/api/events/${eventId}/join`, {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok && data.user) {
        setParticipants((prev) => [...prev, data.user]);
        toast.success("Вы успешно вступили в событие");
      } else if (res.status === 401) {
        toast.error("Необходимо войти в аккаунт");
      } else {
        toast.error(data.message || "Ошибка при вступлении");
      }
    });
  };

  const handleKickParticipant = async (userId: number) => {
    startTransition(async () => {
      const res = await fetch(`/api/events/${eventId}/kick?userId=${userId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setParticipants((prev) => prev.filter((u) => u.id !== userId));
        toast.success("Участник удален");
      } else {
        toast.error(data.message || "Ошибка при удалении участника");
      }
    });
  };

  const openKickDialog = (user: User) => {
    setKickUser(user);
    setIsDialogOpen(true);
  };

  const closeKickDialog = () => {
    setKickUser(null);
    setIsDialogOpen(false);
  };

  return (
    <div className={cn("mt-4", className)}>
      <div className="flex justify-between items-center">
        <h3 className="text-[21px] font-semibold [font-family:var(--font-montserrat)]">
          Участники:
        </h3>
        <p className="[font-family:var(--font-montserrat)] opacity-70">
          Осталось {participantsCount - participants.length}
        </p>
      </div>
      <div
        className="flex flex-col gap-2 overflow-y-auto max-h-[350px] scrollbar-thin scrollbar-thumb-[#1D3C6A] mt-4"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#1D3C6A #e0e0e0" }}
      >
        {participants.length === 0 ? (
          <p className="text-[16px] text-gray-500">Пока никого нет</p>
        ) : (
          participants.map((user) => {
            const isCreator = user.id === createdBy.id;

            return (
              <div
                className="w-full min-h-[80px] h-[80px] bg-[#f5f6fa] px-[19px] rounded-[2px] gap-4 flex items-center justify-between"
                key={user.id}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="cursor-pointer w-[50px] h-[50px] hover:opacity-90 transition-opacity text-[20px]">
                    <AvatarImage
                      src={user.image ?? undefined}
                      className="w-full h-full object-cover rounded-full"
                    />
                    <AvatarFallback className="bg-white">
                      {user.name?.charAt(0) ?? "П"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-[#2E1A1A] text-[19px] hover:text-[#3A5F9D] transition-colors">
                      {user.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isCreator && <Crown className="text-yellow-400" />}
                  {currentUser?.id == createdBy.id &&
                    user.id !== createdBy.id && (
                      <X
                        size={25}
                        className="text-red-600 cursor-pointer hover:text-red-700"
                        onClick={() => openKickDialog(user)}
                      />
                    )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4">
        {isJoined ? (
          <p className="text-green-600 text-[20px] [font-family:var(--font-montserrat)] font-medium">
            Вы участвуете в событии
          </p>
        ) : participants.length >= participantsCount ? (
          <p className="text-red-600 text-[20px] [font-family:var(--font-montserrat)] font-medium">
            Места закончились
          </p>
        ) : (
          <Button
            onClick={handleJoin}
            disabled={isPending}
            className="w-[200px] h-[50px] text-[17px]"
            loading={isPending}
          >
            Вступить
          </Button>
        )}
      </div>

      {/* Модальное окно подтверждения удаления */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-semibold!">
              Вы хотите удалить участника?
            </DialogTitle>
            <div className="flex items-center gap-4">
              {kickUser && (
                <div className="flex w-full min-h-[80px] h-[80px] bg-[#f5f6fa] px-[19px] rounded-[2px] mt-[20px]">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-[50px] h-[50px]">
                      <AvatarImage
                        src={kickUser.image ?? undefined}
                        className="w-full h-full object-cover rounded-full"
                      />
                      <AvatarFallback className="bg-white text-[20px]">
                        {kickUser.name?.charAt(0) ?? "П"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[#2E1A1A] text-[19px] ">
                      {kickUser.name}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button
              className=" w-[120px] h-[40px]"
              onClick={() => setIsDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button
              variant="outline"
              className="text-[#3A5F9D] w-[120px] h-[40px]"
              onClick={() => {
                if (kickUser) {
                  handleKickParticipant(kickUser.id);
                  closeKickDialog();
                }
              }}
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
