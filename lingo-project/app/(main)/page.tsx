import {
  AccordionMain,
  CategoriesList,
  Container,
  EventList,
  Filters,
  Title,
} from "@/components/shared/";
import { Button } from "@/components/ui";
import { Suspense } from "react";

export default async function Home() {
  return (
    <>
      <Container>
        <div className="flex justify-between gap-[30px]">
          <div className="flex w-[74%] py-[30px] px-[57px] gap-[30px] flex-col bg-[url('/images/block-back.png')] bg-cover bg-center">
            <div className="text-black text-[48px] leading-11 [font-family:var(--font-montserrat)] font-bold">
              LinGo — это <br /> сервис для организации <br />и поиска досуга
              вместе
            </div>
            <div className="text-[#333333] text-[24px] leading-7">
              Планируйте события,
              <br /> находите единомышленников и открывайте новые <br />
              возможности для интересного <br />
              времяпрепровождения!
            </div>
            <Button className="w-[180px] h-[50px]">Найти</Button>
          </div>
          <div className="flex w-[26%]  gap-[13px] flex-col">
            <p className="text-[20px] font-medium [font-family:var(--font-montserrat)]">
              Наши преимущества
            </p>
            <AccordionMain />
          </div>
        </div>
      </Container>
      {/* Категории */}
      <Container>
        <Title text={"Категории"} url="/categories" className="font-semibold" />
        <CategoriesList className="mt-[27px]" limit={6} />
      </Container>
      {/* Все события, доделать груплист и сам элемент карточки */}
      <Container>
        <Title text={"Все события"} className="font-semibold" url="/events" />
        <Suspense>
          <Filters className="mt-[27px]" />
        </Suspense>
        <Suspense>
          <EventList />
        </Suspense>
      </Container>
    </>
  );
}
