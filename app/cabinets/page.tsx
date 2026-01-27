"use client";

import Link from "next/link";
import { apiFetchClient } from "../apiFetch";
import { Cabinet, cabinetTypeLabels } from "./types";
import { useEffect, useState } from "react";

export default function CabinetsPage() {
  const [cabinets, setCabinets] = useState<Cabinet[]>([])
          
    useEffect(() => {
      async function fetchCabinets() {
        try {
          const data = await apiFetchClient<Cabinet[]>("/v1/cabinets");
          setCabinets(data.response || []);
        } catch (error) {
          console.error("Error fetching cabinet:", error);
        }
      }
      fetchCabinets();
    }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-500">Кабинеты</h1>
        <Link
          href="/cabinets/new"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
        >
          Добавить кабинет
        </Link>
      </div>

      {cabinets.length === 0 ? (
        <p className="text-gray-500">Кабинеты не найдены</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Факультет
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Корпус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Кабинет
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Тип кабинета
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Назначение кабинета
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Оснащенность кабинета
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Приспособленность для использования инвалидами и лицами с ОВЗ для учебного кабинета
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cabinets.map((cabinet) => (
                  <tr key={cabinet.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cabinet.faculty_name || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cabinet.building || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cabinet.auditorium || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cabinetTypeLabels[cabinet.type] || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cabinet.appointment || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cabinet.equipment ? (
                        <div className="space-y-1 text-xs">
                          <div>
                            <span className="font-semibold text-gray-900">Учебная мебель</span>: {cabinet.equipment.furniture || "—"}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900">Технические средства для представления учебной информации</span>: {cabinet.equipment.technical_means || "—"}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900">Компьютерная техника</span>: {cabinet.equipment.computer_equipment || "—"}
                          </div>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cabinet.suitable_for_peoples_with_special_needs ? "Да" : "Нет"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/cabinets/${cabinet.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Открыть
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

