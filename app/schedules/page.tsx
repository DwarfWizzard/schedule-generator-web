"use client";

import Link from "next/link";
import { apiFetchClient } from "../lib/apiFetch";
import { Schedule, scheduleTypeLabels } from "./types";
import { useEffect, useMemo, useRef, useState } from "react";

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  // Фильтры
  const [groupFilter, setGroupFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [groupQuery, setGroupQuery] = useState("");      // текст в поле поиска
  const [groupOpen, setGroupOpen] = useState(false);     // открыт ли список
  const groupRef = useRef<HTMLDivElement>(null);         // для клика вне

  useEffect(() => {
    async function fetchSchedules() {
      try {
        const data = await apiFetchClient<Schedule[]>("/v1/schedules");
        setSchedules(data.response || []);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    }
    fetchSchedules();
  }, []);

  // Уникальные значения для выпадающих списков
  const groups = useMemo(
    () =>
      Array.from(
        new Set(schedules.map((s) => s.edu_group_number).filter(Boolean))
      ).sort() as string[],
    [schedules]
  );

  const semesters = useMemo(
    () =>
      Array.from(
        new Set(schedules.map((s) => s.semester).filter((v) => v != null))
      ).sort((a, b) => Number(a) - Number(b)),
    [schedules]
  );

  const filteredGroups = useMemo(() => {
    const q = groupQuery.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter((g) => g.toLowerCase().includes(q));
  }, [groups, groupQuery]);

  // Применение фильтров
  const filtered = useMemo(() => {
    return schedules.filter((s) => {
      if (groupFilter && s.edu_group_number !== groupFilter) return false;
      if (semesterFilter && String(s.semester) !== semesterFilter) return false;

      const start = s.start_date?.toString().split("T")[0] || "";
      const end = s.end_date?.toString().split("T")[0] || "";

      // Пересечение периодов: расписание попадает, если его интервал
      // пересекается с выбранным [dateFrom, dateTo]
      if (dateFrom && end && end < dateFrom) return false;
      if (dateTo && start && start > dateTo) return false;

      return true;
    });
  }, [schedules, groupFilter, semesterFilter, dateFrom, dateTo]);

  const resetFilters = () => {
  setGroupFilter("");
  setGroupQuery("");
  setSemesterFilter("");
  setDateFrom("");
  setDateTo("");
};

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-500">Расписания</h1>
        <Link
          href="/schedules/new"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
        >
          Добавить расписание
        </Link>
      </div>

      {/* Панель фильтров */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Группа — поиск с автодополнением */}
          <div className="relative"
            ref={groupRef}
            onBlur={(e) => {
              // Закрываем только если фокус ушёл за пределы контейнера
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setGroupOpen(false);
              }
            }}
            tabIndex={-1}
          >
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
              Группа
            </label>

            <div className="relative">
              <input
                type="text"
                value={groupQuery}
                onChange={(e) => {
                  setGroupQuery(e.target.value);
                  setGroupOpen(true);
                  if (e.target.value === "") setGroupFilter("");
                }}
                onFocus={() => setGroupOpen(true)}
                placeholder="Поиск группы..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {groupQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setGroupQuery("");
                    setGroupFilter("");
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
                  aria-label="Очистить"
                >
                  ×
                </button>
              )}
            </div>

            {groupOpen && (
              <ul className="absolute z-20 mt-1 w-full max-h-64 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg">
                <li
                  onClick={() => {
                    setGroupFilter("");
                    setGroupQuery("");
                    setGroupOpen(false);
                  }}
                  className="px-3 py-2 text-sm text-gray-500 cursor-pointer hover:bg-gray-50"
                >
                  Все группы
                </li>
                {filteredGroups.length === 0 ? (
                  <li className="px-3 py-2 text-sm text-gray-400">
                    Ничего не найдено
                  </li>
                ) : (
                  filteredGroups.map((g) => (
                    <li
                      key={g}
                      onClick={() => {
                        setGroupFilter(g);
                        setGroupQuery(g);
                        setGroupOpen(false);
                      }}
                      className={`px-3 py-2 text-sm cursor-pointer hover:bg-green-50 ${
                        groupFilter === g
                          ? "bg-green-100 text-green-900 font-medium"
                          : "text-gray-900"
                      }`}
                    >
                      {g}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          {/* Семестр */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
              Семестр
            </label>
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="" className="text-gray-900">
                Все семестры
              </option>
              {semesters.map((s) => (
                <option key={String(s)} value={String(s)} className="text-gray-900">
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Период: с */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
              Период с
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Период: по */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
              Период по
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">
            Найдено: {filtered.length} из {schedules.length}
          </span>
          <button
            onClick={resetFilters}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Сбросить фильтры
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">
          {schedules.length === 0
            ? "Расписания не найдены"
            : "Нет расписаний, подходящих под фильтры"}
        </p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Группа
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Семестр
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тип
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Период
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((s: Schedule) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {s.id}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    title={s.edu_group_id}
                  >
                    {s.edu_group_number || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {s.semester || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {scheduleTypeLabels[s.type] || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {s.start_date?.toString().split("T")[0] || "—"} –{" "}
                    {s.end_date?.toString().split("T")[0] || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/schedules/${s.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Открыть
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
