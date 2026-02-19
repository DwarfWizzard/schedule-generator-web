'use client';

import Link from "next/link";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { JwtPayload } from "./lib/jwt";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      router.push('/login');
      return;
    }

    const payloadStr = localStorage.getItem('user_payload');
    if (payloadStr) {
      try {
        const payload = JSON.parse(payloadStr) as JwtPayload;
        setUserRole(payload.user_role);
      } catch (e) {
        console.error('Failed to parse user_payload', e);
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }

    setIsLoading(false);
  }, [router]);

  // Показываем загрузку пока проверяем авторизацию
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  const isAdmin = userRole === 1;

const sections = [
    {
      key: 'cabinets',
      title: "Кабинеты",
      description: "Управление кабинетами вуза",
      href: "/cabinets",
      color: "bg-teal-500 hover:bg-teal-600",
      protectedByRole: true, // скрывать, если роль != 1
    },
    {
      key: 'users',
      title: "Пользователи",
      description: "Пользователи системы",
      href: "/users",
      color: "bg-cyan-500 hover:bg-teal-600",
      protectedByRole: true, // скрывать, если роль != 1
    },
    {
      key: 'departments',
      title: "Кафедры",
      description: "Управление кафедрами учебного заведения",
      href: "/departments",
      color: "bg-blue-500 hover:bg-blue-600",
      protectedByRole: false, // только для роли 1?
    },
    {
      key: 'edu-directions',
      title: "Направления подготовки",
      description: "Управление направлениями подготовки",
      href: "/edu-directions",
      color: "bg-green-500 hover:bg-green-600",
      protectedByRole: false,
    },
    {
      key: 'edu-plans',
      title: "Учебные планы",
      description: "Управление учебными планами",
      href: "/edu-plans",
      color: "bg-purple-500 hover:bg-purple-600",
      protectedByRole: false,
    },
    {
      key: 'edu-groups',
      title: "Учебные группы",
      description: "Управление группами студентов",
      href: "/edu-groups",
      color: "bg-orange-500 hover:bg-orange-600",
      protectedByRole: false,
    },
    {
      key: 'teachers',
      title: "Преподаватели",
      description: "Управление преподавателями вуза",
      href: "/teachers",
      color: "bg-red-500 hover:bg-red-600",
      protectedByRole: false,
    },
    {
      key: 'schedules',
      title: "Расписания",
      description: "Создание расписаний и выгрузка в CSV",
      href: "/schedules",
      color: "bg-indigo-500 hover:bg-indigo-600",
      protectedByRole: false,
    },
  ];

  const visibleSections = sections.filter((section) => {
    if (!section.protectedByRole) return true;
    return isAdmin;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-500">
        Добро пожаловать в систему управления расписаниями
      </h1>
      <p className="text-gray-600 mb-8">Выберите раздел для работы</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleSections.map((section) => (
          <Link
            key={section.key}
            href={section.href}
            className={`${section.color} text-white rounded-lg p-6 shadow-lg transition-all transform hover:scale-105 hover:shadow-xl`}
          >
            <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
            <p className="text-white/90">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
