"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Container } from "../container";
import Link from "next/link";
import { Avatar } from "../../ui";
import { AvatarFallback, AvatarImage } from "../../ui/avatar";
import { LogIn, Menu, X } from "lucide-react";
import { AuthModal } from "../modals";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

interface Props {
  initSession: Session | null;
  className?: string;
}

export const Header: React.FC<Props> = ({ initSession, className }) => {
  const [openAuthModal, setAuthOpenModal] = React.useState(false);

  const { data: clientSession } = useSession();

  const [menuOpen, setMenuOpen] = React.useState(false);

  const session = clientSession || initSession;

  const getFirstName = (fullName?: string | null) => {
    if (!fullName) return "Профиль";
    return fullName.split(" ")[0];
  };

  const navItems = [
    { id: 1, title: "Главная", href: "/" },
    { id: 2, title: "Категории", href: "/categories" },
    { id: 3, title: "Все события", href: "/events" },
    { id: 4, title: "События с вами", href: "/my-events" },
  ];

  const isAdmin = session?.user?.role === "ADMIN";

  if (isAdmin) {
    navItems.push({ id: 99, title: "Админка", href: "/admin/events" });
  }

  return (
    <>
      <header
        className={cn("flex justify-between items-center m-[16px]", className)}
      >
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
        <span className="text-[30px] hover:text-[#3A5F9D] duration-200 [font-family:var(--font-montserrat)] font-semibold">
            LinGo
          </span>
          <span className="text-[#1D3C6A] text-[20px] hidden sm:block">
            Санкт-Петербург
          </span>
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden focus:outline-none"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {session?.user ? (
          <div className="flex justify-center items-center relative gap-3">
            <Link href="/profile" className="flex items-center gap-3">
            <p className="text-[#2E1A1A] text-[18px] hover:text-[#3A5F9D] transition-colors hidden sm:flex">
                {getFirstName(session.user.name)}
              </p>
              <Avatar className="cursor-pointer w-[50px] h-[50px] hover:opacity-90 transition-opacity">
                <AvatarImage
                  src={session.user.image ?? undefined}
                  className="w-full h-full object-cover rounded-full"
                />
                <AvatarFallback>
                  {getFirstName(session.user.name)?.charAt(0) ?? "П"}
                </AvatarFallback>
              </Avatar>
              <svg
                className="absolute top-8 right-0 w-[20px] h-[20px] cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
              >
                <rect width="21" height="21" rx="10.5" fill="#3A5F9D" />
                <path
                  d="M6.375 12.9063V14.625H8.09375L13.1629 9.55583L11.4442 7.83708L6.375 12.9063ZM14.4921 8.22667C14.6708 8.04792 14.6708 7.75917 14.4921 7.58042L13.4196 6.50792C13.2408 6.32917 12.9521 6.32917 12.7733 6.50792L11.9346 7.34667L13.6533 9.06542L14.4921 8.22667Z"
                  fill="white"
                />
              </svg>
            </Link>
          </div>
        ) : (
          <button
            onClick={() => setAuthOpenModal(true)}
            className="flex justify-center items-center relative gap-2 border border-[#aebdf3] rounded-[2px] cursor-pointer px-[15px] py-[6px] duration-200 hover:bg-[#e6e6f4]"
          >
            <p className="text-[#3A5F9D] text-[16px]">Войти</p>
            <LogIn width={20} height={17} color="#3A5F9D" />
          </button>
        )}
        <AuthModal
          open={openAuthModal}
          onClose={() => setAuthOpenModal(false)}
        />
      </header>

      <Container className="hidden sm:flex justify-around py-[10px] sticky top-0 shadow-md bg-[#F5F6FA] z-30 mb-[30px] [font-family:var(--font-montserrat)] ">
        {navItems.map((item) => (
          <Link
            key={item.id}
            className={
              "text-[#333333] text-[20px] transition-colors duration-150 hover:text-[#3A5F9D]"
            }
            href={item.href}
          >
            {item.title}
          </Link>
        ))}
      </Container>

      {menuOpen && (
        <div className="sm:hidden bg-[#F5F6FA] shadow-md px-4 pb-4">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="block py-2 text-[#333333] hover:text-[#3A5F9D]"
              onClick={() => setMenuOpen(false)}
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};
