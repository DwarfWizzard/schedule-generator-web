"use client";

import Link from "next/link";
import { apiFetchClient } from "../lib/apiFetch";
import { EduDirection } from "./types";
import { useEffect, useMemo, useState } from "react";

export default function EducationDirectionsPage() {
  const [directions, setEduDirections] = useState<EduDirection[]>([]);

  // Состояния фильтров
  const [idFilter, setIdFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  useEffect(() => {
    async function fetchEduDirections() {
      try {
        const data = await apiFetchClient<EduDirection[]>("/v1/edu-directions");
        setEduDirections(data.response || []);
      } catch (error) {
        console.error("Error fetching edu directions:", error);
      }
    }
    fetchEduDirections();
  }, []);

  const filteredDirections = useMemo(() => {
    return directions.filter((dir) => {
      const matchId = String(dir.id || "")
        .toLowerCase()
        .includes(idFilter.toLowerCase().trim());
      const matchName = (dir.name || "")
        .toLowerCase()
        .includes(nameFilter.toLowerCase().trim());

      return matchId && matchName;
    });
  }, [directions, idFilter, nameFilter]);

  const resetFilters = () => {
    setIdFilter("");
    setNameFilter("");
  };

  const hasActiveFilters = Boolean(idFilter || nameFilter);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-500">
          Направления подготовки
        </h1>
        <Link
          href="/edu-directions/new"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
        >
          Добавить направление
        </Link>
      </div>

      {/* Блок фильтров */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
              ID
            </label>
            <input
              type="text"
              value={idFilter}
              onChange={(e) => setIdFilter(e.target.value)}
              placeholder="Поиск по ID..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
              Название направления
            </label>
            <input
              type="text"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Введите код или название направления..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
            <span>Найдено записей: {filteredDirections.length}</span>
            <button
              onClick={resetFilters}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>

      {filteredDirections.length === 0 ? (
        <p className="text-gray-500">Направления не найдены</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Название
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDirections.map((dir) => (
                <tr key={dir.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dir.id || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dir.name || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/edu-directions/${dir.id}`}
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
      )}
    </div>
  );
}

