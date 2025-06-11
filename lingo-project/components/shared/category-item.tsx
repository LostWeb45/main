import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
  title: string;
  imageUrl: string;
  id: number;
  eventsCount: number;
  className?: string;
}

export const CategoryItem: React.FC<Props> = ({
  title,
  imageUrl,
  id,
  eventsCount,
  className,
}) => {
  return (
    <Link
      className={cn(className)}
      href={`/categories/search?categoryId=${id}`}
    >
      <div className="flex pl-[30px] items-center  h-[105px] bg-[#fafcfe]  hover:bg-[#F5F6FA] transition rounded-[1px]">
        <img
          src={`/images/categories-ico/${imageUrl}`}
          alt={title}
          className="w-[55px]"
        />
        <div className="pl-[45px]">
          <h3 className="text-[#2E1A1A] text-[18px]  ">{title}</h3>
          <p className="text-[#333333] text-[14px] opacity-60">
            {eventsCount} {eventsCount === 1 ? "событие" : "событий"}
          </p>
        </div>
      </div>
    </Link>
  );
};
