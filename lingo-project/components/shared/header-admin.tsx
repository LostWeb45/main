import React from "react";
import { Container } from "./container";
import Link from "next/link";

interface Props {
  className?: string;
}

export const HeaderAdmin: React.FC<Props> = ({ className }) => {
  return (
    <Container className={className}>
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[30px] [font-family:var(--font-montserrat)] font-semibold">
            LinGo
          </span>
          <span className="text-[#1D3C6A] text-[20px]">Администрирование</span>
        </div>
        <div>
          <Link href="/" className="text-[20px]">
            Главная
          </Link>
        </div>
        <div>
          <Link href="/admin/events" className="text-[20px]">
            События на проверке
          </Link>
        </div>
        <div>
          <Link href="/admin/events" className="text-[20px]">
            Пользователи
          </Link>
        </div>
      </div>
    </Container>
  );
};
