import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface Props {
  className?: string;
}

export const Footer: React.FC<Props> = ({ className }) => {
  return (
    <footer
      className={cn(
        "flex flex-col min-h-[320px] items-center justify-center bg-[#F2F7FA] relative mt-[30px]",
        className
      )}
    >
      <div className="absolute text-[100px] left-[-90px] font-semibold opacity-10 rotate-90 [font-family:var(--font-montserrat)]">
        LinGo
      </div>
      <div className="flex flex-col sm:flex-row justify-center sm:flex gap-[20px] sm:gap-[150px] flex-wrap">
        <div className="flex flex-col gap-[10px] font-medium">
          <div className="text-[19px] text-[#333333]">Помощь</div>
          <div className="text-[16px] text-[#585858] font-medium">
            konstintinp@gmail.com
          </div>
          <div className="text-[16px] text-[#585858] font-medium">
            kostik052005@gmail.com
          </div>
        </div>
        <div className="flex flex-col gap-[10px]">
          <div className="text-[19px] text-[#333333] font-medium">
            О компании
          </div>
          <Link
            href={"/terms"}
            className="text-[16px] hover:text-[#3A5F9D] duration-200 text-[#585858] font-medium "
          >
            Пользовательское соглашение
          </Link>
        </div>
        <div className="flex flex-col gap-[10px]">
          <div className="text-[19px] text-[#333333] font-medium">
            Наши контакты
          </div>
          <div className="text-[16px] text-[#585858] font-medium ">
            konstintinp@gmail.com
          </div>
          <div className="text-[16px] text-[#585858] font-medium ">
            г. Санкт-Петербург
          </div>
        </div>
      </div>
      <div className="hidden sm:block sm:absolute bottom-3 text-[18px] [font-family:var(--font-montserrat)]">
        © ООО «Lingo» 2025
      </div>
    </footer>
  );
};
