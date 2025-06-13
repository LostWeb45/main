import {
  AccordionMain,
  CategoriesList,
  Container,
  EventList,
  Filters,
  Title,
} from "@/components/shared/";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home() {
  return (
    <>
      <Container>
        <div className="flex justify-between gap-[30px]">
        <div className="flex w-[100%]  sm:w-[74%] py-[15px] sm:py-[30px] px-[10px] sm:px-[57px] gap-[10px] sm:gap-[30px] flex-col bg-[url('/images/block-back.png')] bg-cover bg-center ">
        <div className="text-black text-[20px] sm:text-[48px] sm:leading-11 [font-family:var(--font-montserrat)] font-bold ">
              LinGo — это <br /> сервис для организации <br />и поиска досуга
              вместе
            </div>
            <div className="text-[#333333] text-[15px] sm:text-[24px] sm:leading-7">
              Планируйте события,
              <br /> находите единомышленников и открывайте новые <br />
              возможности для интересного <br />
              времяпрепровождения!
            </div>
            
            <Link
              href="/events"
              className="bg-[#3A5F9D] text-primary-foreground hover:bg-[#3a5e9dec] inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap text-md transition-all disabled:pointer-events-none disabled:opacity-65 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive w-[100px] sm:w-[180px] sm:h-[50px] text-[15px] h-[35px] sm:text-[18px]"
            >
              Найти
            </Link>
            
          </div>
          <div className="w-[26%] gap-[13px] flex-col hidden sm:flex">
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
