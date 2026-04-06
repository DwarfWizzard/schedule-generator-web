import type { Metadata } from "next";
import "./globals.css";
import { MainNav } from "./components/MainNav";

export const metadata: Metadata = {
  title: "Система управления расписаниями",
  description: "Веб-интерфейс для управления расписаниями учебного заведения",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="antialiased">
        <MainNav />
        <main className="min-h-screen bg-gray-50">{children}</main>
      </body>
    </html>
  );
}