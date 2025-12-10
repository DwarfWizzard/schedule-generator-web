"use client";

import Link from "next/link";
import { apiFetchClient } from "../apiFetch";
import { Schedule, scheduleTypeLabels } from "./types";
import { useEffect, useState } from "react";

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])

  useEffect(() => {
      async function fetchSchedules() {
        try {
          const data = await apiFetchClient<Schedule[]>("/v1/schedules");
          setSchedules(data.response || []);
        } catch (error) {
          console.error("Error fetching edu plans:", error);
        }
      }
      fetchSchedules();
    }, []);


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

      {schedules.length === 0 ? (
        <p className="text-gray-500">Расписания не найдены</p>
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
              {schedules.map((s: Schedule) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {s.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" title={s.edu_group_id}>
                    {s.edu_group_number || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {s.semester || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {scheduleTypeLabels[s.type] || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {s.start_date?.toString().split("T")[0] || "—"} – {s.end_date?.toString().split("T")[0] || "—"}
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