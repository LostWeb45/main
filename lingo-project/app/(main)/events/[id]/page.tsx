import { prisma } from "@/prisma/prisma-client";
import { Container, EventChat, Title } from "@/components/shared";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/caruosel";
import { getFormattedDateTime } from "@/lib";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { EventParticipants } from "@/components/shared/event-participants";
import SafeHTML from "@/components/shared/safe-html";
import { getServerSession } from "next-auth";
import { authOptions } from "@/constants/auth-options";

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id: parseInt(id) },
    include: {
      createdBy: true,
      category: true,
      town: true,
      status: true,
      images: true,
      participants: true,
    },
  });

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!event) return <Container>Событие не найдено</Container>;

  const hasMultipleImages = event.images.length > 1;

  return (
    <Container className="flex flex-col">
      {event.images.length > 0 && (
       <Carousel>
          <CarouselContent>
            {event.images.map((img, i) => (
              <CarouselItem key={i}>
                <div className="relative overflow-hidden aspect-[16/9] mx-auto">
                  <img
                    src={`http://82.202.128.170:4000/${img.imageUrl}`}
                    alt={`img-${i}`}
                    className="object-cover w-full h-full transition-all duration-300 transform hover:scale-105"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {hasMultipleImages && (
            <>
              <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black rounded-full p-2 hover:bg-opacity-50 z-10" />
              <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black rounded-full p-2 hover:bg-opacity-50 z-10" />
            </>
          )}
        </Carousel>
      )}
      <div
        className={cn(
          "flex flex-col justify-between sm:flex-row gap-[30px]",
          event.images.length > 0 ? "mt-[20px]" : ""
        )}
      >
        <div className="flex flex-col gap-[15px] sm:w-[63%]">
        <Title text={event.title} className="font-bold sm:text-[33px]" />
          <div className="flex flex-col items-start gap-2">
            <p className=" [font-family:var(--font-montserrat)] font-bold text-[17px] opacity-60 text-[#1D3C6A]">
              {event.age}+
            </p>
            <hr className="w-[30%] mt-1" />
          </div>

          <div className="text-[18px] max-w-full overflow-hidden break-words">
            <SafeHTML html={event.description} />
          </div>
          {event.status.name === "Предстоящее" && (
            <EventChat
              eventId={event.id}
              userId={Number(userId)}
              participants={event.participants}
            />
          )}
        </div>

        <div className="sm:w-[37%] mt-[7px] ">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center opacity-90">
            <p className="sm:text-[21px] font-medium">
                {getFormattedDateTime(
                  new Date(event.startDate),
                  event.startTime,
                  event.duration
                )}
              </p>
              <p className="sm:text-[23px] font-medium opacity-90">
                {event.price ? `Средняя цена: ${event.price}₽` : "бесплатно"}
              </p>
            </div>
            <div className="flex items-center">
              <MapPin
                width={24}
                height={24}
                className="mr-[6px] min-w-[24px] text-[#1D3C6A] opacity-70"
              />
              <p className="text-[18px] opacity-90 font [font-family:var(--font-montserrat)]">
                {event.place}
              </p>
            </div>
          </div>
          {/* Участники */}
          {event.status.name === "Предстоящее" ? (
            <EventParticipants
              eventId={event.id}
              initialParticipants={event.participants}
              participantsCount={event.participantsCount}
              createdBy={event.createdBy}
            />
          ) : (
            <p className="text-[16px] text-gray-500 mt-[30px]">
              Пока событие на модерации, в него нельзя вступить
            </p>
          )}
        </div>
      </div>
    </Container>
  );
}
