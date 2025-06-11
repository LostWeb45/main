import React from "react";
import { Accordion } from "../ui";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export const AccordionMain: React.FC<Props> = ({ className }) => {
  return (
    <Accordion
      type="single"
      defaultValue="item-1"
      className={cn(
        className,
        "flex flex-col px-5  bg-[#fafcfe] [font-family:var(--font-montserrat)]"
      )}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="group flex justify-between items-center py-3 text-[17px] font-bold text-[#1D3C6A] transition-colors hover:text-[#3A5F9D] no-underline">
          Удобное вступление и напоминания
        </AccordionTrigger>
        <AccordionContent className="text-[#333] text-[14px] leading-[20px] pb-2">
          Вы можете вступать в события в один клик, подключить напоминания в
          профиле и быть уверенным, что не пропустите ничего важного.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger className="group flex justify-between items-center  text-[17px] font-bold text-[#1D3C6A] transition-colors hover:text-[#3A5F9D] no-underline">
          Быстрый доступ к мероприятиям
        </AccordionTrigger>
        <AccordionContent className="text-[#333] text-[14px] leading-[20px] pb-2">
          Платформа показывает актуальные события рядом с вами — не нужно
          тратить время на поиски в соцсетях или переписках.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger className="group flex justify-between items-center py-3 text-[17px] font-bold text-[#1D3C6A] transition-colors hover:text-[#3A5F9D] no-underline">
          Общение и новые знакомства
        </AccordionTrigger>
        <AccordionContent className="text-[#333] text-[14px] leading-[20px] pb-2">
          После вступления в событие можно общаться с другими участниками —
          находите единомышленников ещё до начала мероприятия.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
