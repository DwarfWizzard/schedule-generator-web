import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Система управления расписаниями",
  description: "Веб-интерфейс для управления расписаниями учебного заведения",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="bg-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Система управления расписаниями</h1>
              <div className="flex gap-4"> 
                <Link href="/" className="hover:text-blue-200 transition">Главная</Link>
                <Link href="/departments" className="hover:text-blue-200 transition">Кафедры</Link>
                <Link href="/edu-directions" className="hover:text-blue-200 transition">Направления</Link>
                <Link href="/edu-plans" className="hover:text-blue-200 transition">Учебные планы</Link>
                <Link href="/edu-groups" className="hover:text-blue-200 transition">Группы</Link>
                <Link href="/teachers" className="hover:text-blue-200 transition">Преподаватели</Link>
                <Link href="/cabinets" className="hover:text-blue-200 transition">Кабинеты</Link>
                <Link href="/schedules" className="hover:text-blue-200 transition">Расписания</Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
