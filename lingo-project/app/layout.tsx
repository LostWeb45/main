import { Monda, Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const mondo = Monda({
  subsets: ["latin"],
  variable: "--font-mondo",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${mondo.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
