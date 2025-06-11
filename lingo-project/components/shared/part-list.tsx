import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@prisma/client";

interface ParticipantsListProps {
  participants: User[];
  maxParticipants: number;
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({
  participants,
  maxParticipants,
}) => {
  const remainingCount = maxParticipants - 5;

  return (
    <div className="relative flex items-center">
      {Array.from({ length: maxParticipants }).map((_, index) => {
        const participant = participants[index];

        return (
          <Avatar
            key={index}
            className={`cursor-pointer w-[38px] h-[38px] hover:opacity-90 transition-opacity ${
              index > 0 ? "-ml-3" : ""
            } ${index >= 5 ? "hidden" : ""}`}
          >
            {participant?.image ? (
              <AvatarImage
                src={participant.image}
                className="w-full h-full object-cover rounded-full"
              />
            ) : participant?.name ? (
              <AvatarFallback className="bg-[#fcfcfc]  text-[16px]">
                {participant.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            ) : (
              <AvatarFallback className="bg-[#D6E6F2] flex items-center justify-center">
                <svg
                  className="w-[12px]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M12 2C12 0.895431 11.1046 0 10 0V0C8.89543 0 8 0.895431 8 2V4C8 6.20914 6.20914 8 4 8H2C0.895431 8 0 8.89543 0 10V10C0 11.1046 0.895431 12 2 12H4C6.20914 12 8 13.7909 8 16V18C8 19.1046 8.89543 20 10 20V20C11.1046 20 12 19.1046 12 18V16C12 13.7909 13.7909 12 16 12H18C19.1046 12 20 11.1046 20 10V10C20 8.89543 19.1046 8 18 8H16C13.7909 8 12 6.20914 12 4V2Z"
                    fill="black"
                  />
                </svg>
              </AvatarFallback>
            )}
          </Avatar>
        );
      })}

      {remainingCount > 0 && (
        <div className="w-[38px] h-[38px] -ml-3 flex items-center justify-center bg-red text-[#a7a4a4] font-semibold text-sm rounded-full border">
          +{remainingCount}
        </div>
      )}
    </div>
  );
};
