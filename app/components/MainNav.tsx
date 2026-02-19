'use client';

import Link from "next/link";
import type { JwtPayload } from "../lib/jwt"; // поправь путь при необходимости
import { removeTokens } from "../lib/apiFetch";
import { useRouter } from "next/navigation";

export function MainNav() {
  const router = useRouter();

  let { userRole, userName } = (() => {
    if (typeof window === 'undefined') {
      return { userRole: null, userName: null };
    }

    try {
      const payloadStr = localStorage.getItem("user_payload");
      if (!payloadStr) {
        return { userRole: null, userName: null };
      }

      const payload = JSON.parse(payloadStr) as JwtPayload;

      return {
        userRole: payload.user_role,
        userName: payload.user_name,
      };
    } catch (e) {
      console.error("Failed to parse user_payload", e);
      return { userRole: null, userName: null };
    }
  })();

  const isAdmin = userRole === 1;

  const handleLogout = () => {
    removeTokens();
    userRole = null;
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">

          {/* Левая часть */}
          <div className="flex-1">
            <h1 className="text-xl font-bold whitespace-nowrap">
              Система управления расписаниями
            </h1>
          </div>

          {/* Центральная навигация */}
          <div className="flex flex-wrap justify-center gap-4 flex-1">
            <Link href="/" className="hover:text-blue-200 transition">
              Главная
            </Link>
            {isAdmin && (
              <>
                <Link href="/cabinets" className="hover:text-blue-200 transition">
                  Кабинеты
                </Link>
                <Link href="/users" className="hover:text-blue-200 transition">
                  Пользователи
                </Link>
              </>
            )}
            <Link href="/departments" className="hover:text-blue-200 transition">
              Кафедры
            </Link>
            <Link href="/edu-directions" className="hover:text-blue-200 transition">
              Направления
            </Link>
            <Link href="/edu-plans" className="hover:text-blue-200 transition">
              Учебные планы
            </Link>
            <Link href="/edu-groups" className="hover:text-blue-200 transition">
              Группы
            </Link>
            <Link href="/teachers" className="hover:text-blue-200 transition">
              Преподаватели
            </Link>
            <Link href="/schedules" className="hover:text-blue-200 transition">
              Расписания
            </Link>
          </div>

          {/* Правая часть */}
          <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
            {userRole !== null && (
              <>
                <p className="truncate max-w-[200px]">
                  Пользователь: {userName}
                </p>
                <button
                  onClick={handleLogout}
                  className="bg-cyan-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Выйти
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
