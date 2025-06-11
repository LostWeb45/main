import type { Metadata } from "next";
import "../globals.css";
import { Footer, HeaderServer } from "@/components/shared/";
import { TostsParamsClientWrapper } from "@/components/shared/tosts-clientwrapper";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "LinGo | Главная страница",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
      <HeaderServer />
      <Suspense fallback={null}>
        <TostsParamsClientWrapper />
      </Suspense>
      <div>{children}</div>
      <Footer />
    </main>
  );
}
