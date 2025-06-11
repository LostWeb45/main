import type { Metadata } from "next";
import "../globals.css";
import { Container, HeaderAdmin } from "@/components/shared";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lingo | Главная страница",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <HeaderAdmin />
      {children}
    </main>
  );
}
