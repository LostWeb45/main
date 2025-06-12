"use client";

import { User } from "@prisma/client";
import { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { Button } from "../ui";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ChatMessage {
  id: number;
  eventId?: number;
  senderId: number;
  message: string;
  createdAt: string;
  senderAvatar?: string;
}

export function EventChat({
  eventId,
  userId,
  participants,
}: {
  eventId: number;
  userId: number;
  participants: User[];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<typeof Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isParticipant = participants.some((p) => p.id === userId);

  useEffect(() => {
    if (!isParticipant) return;

    fetch(`http://82.202.128.170:5000/events/${eventId}/messages`)
      .then((res) => res.json())
      .then((data: ChatMessage[]) => setMessages(data));

    socketRef.current = io("http://82.202.128.170:5001", {
      query: { eventId: eventId.toString(), userId: userId.toString() },
    });

    socketRef.current.on("message", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [eventId, userId, isParticipant]);

  useEffect(() => {
    bottomRef.current?.parentElement?.scrollTo({
      top: bottomRef.current.offsetTop,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (isParticipant) {
      window.scrollTo({
        top: document.body.scrollHeight - document.body.scrollHeight * 0.5,
        behavior: "smooth",
      });
    }
  }, [isParticipant]);

  const sendMessage = () => {
    if (input.trim() && socketRef.current) {
      socketRef.current.emit("message", input);
      setInput("");
    }
  };

  if (!isParticipant) {
    return (
      <div className="p-2 mt-2 w-full text-[18px] h-[360px] flex items-center justify-center bg-[#f5f6fa] text-gray-600 text-center">
        Только участники могут пользоваться чатом
      </div>
    );
  }

  return (
    <div className="p-2 shadow-sm mt-2 w-full h-[280px] sm:h-[360px] flex flex-col overflow-hidden bg-white">
      <div className="flex-1 overflow-y-auto mb-2 pr-2">
        {messages.map((msg) => {
          const participant = participants.find((p) => p.id === msg.senderId);
          const isUserMessage = msg.senderId === userId;

          return (
            <div
              key={msg.id}
              className={`mb-1 flex flex-col items-start max-w-fit ${
                isUserMessage ? "ml-auto" : "mr-auto text-left"
              }`}
            >
              <div className="flex gap-2 items-center">
                {!isUserMessage && (
                  <Avatar
                    key={msg.id}
                    className={`cursor-pointer w-[33px] h-[33px] hover:opacity-90 transition-opacity `}
                  >
                    {participant?.image ? (
                      <AvatarImage
                        src={participant.image}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <AvatarFallback className="bg-[#fcfcfc]  text-[16px]">
                        {participant?.name
                          ? participant.name.charAt(0).toUpperCase()
                          : "П"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                )}
                <span
                  className={`font-semibold  ${
                    isUserMessage ? "text-right" : "text-right"
                  }`}
                >
                  {isUserMessage
                    ? "Вы"
                    : participant?.name || `Пользователь ${msg.senderId}`}
                </span>
              </div>
              <div
                className={`pl-2 pr-4 py-1 rounded-md mt-[4px] ${
                  isUserMessage ? "bg-[#d9e4f8] " : "bg-[#ece8e8]"
                }`}
              >
                <div className="text-[18px] break-words whitespace-pre-wrap max-w-[300px] sm:max-w-[400px]">
                  {msg.message}
                </div>
                <small className="text-xs text-gray-500">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <textarea
          className="flex-1 border px-2 py-1 resize-none h-[42px] max-h-[100px] overflow-y-auto"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Напишите сообщение..."
        />
        <Button
          className="w-[150px] h-[42px] text-[15px]"
          onClick={sendMessage}
        >
          Отправить
        </Button>
      </div>
    </div>
  );
}
