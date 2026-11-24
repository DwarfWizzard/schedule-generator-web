"use client";

import Link from "next/link";
import { apiFetchClient } from "../lib/apiFetch";
import { Department } from "./types";
import { useEffect, useMemo, useState } from "react";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);

  // Состояния фильтров
  const [idFilter, setIdFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [externalIdFilter, setExternalIdFilter] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("");

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const data = await apiFetchClient<Department[]>("/v1/departments");
        setDepartments(data.response || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    }
    fetchDepartments();
  }, []);

  // Уникальные факультеты для подсказок при вводе
  const uniqueFaculties = useMemo(() => {
    const faculties = departments
      .map((d) => d.faculty_name)
      .filter((f): f is string => Boolean(f));
    return Array.from(new Set(faculties));
  }, [departments]);

  // Фильтрация данных
  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) => {
      const matchId = String(dept.id || "")
        .toLowerCase()
        .includes(idFilter.toLowerCase().trim());
      const matchName = (dept.name || "")
        .toLowerCase()
        .includes(nameFilter.toLowerCase().trim());
      const matchExternalId = String(dept.external_id || "")
        .toLowerCase()
        .includes(externalIdFilter.toLowerCase().trim());
      const matchFaculty = (dept.faculty_name || "")
        .toLowerCase()
        .includes(facultyFilter.toLowerCase().trim());

      return matchId && matchName && matchExternalId && matchFaculty;
    });
  }, [departments, idFilter, nameFilter, externalIdFilter, facultyFilter]);

  const resetFilters = () => {
    setIdFilter("");
    setNameFilter("");
    setExternalIdFilter("");
    setFacultyFilter("");
  };

  const hasActiveFilters = Boolean(
    idFilter || nameFilter || externalIdFilter || facultyFilter
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-500">Кафедры</h1>
        <Link
          href="/departments/new"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
        >
          Добавить кафедру
        </Link>
      </div>

      {/* Блок фильтров */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              Название кафедры
            </label>
            <input
              type="text"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Введите название..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
              Внешний ID
            </label>
            <input
              type="text"
              value={externalIdFilter}
              onChange={(e) => setExternalIdFilter(e.target.value)}
              placeholder="Поиск по внешнему ID..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
              Факультет
            </label>
            <input
              type="text"
              list="faculties-list"
              value={facultyFilter}
              onChange={(e) => setFacultyFilter(e.target.value)}
              placeholder="Введите или выберите..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <datalist id="faculties-list">
              {uniqueFaculties.map((faculty) => (
                <option key={faculty} value={faculty} />
              ))}
            </datalist>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
            <span>Найдено записей: {filteredDepartments.length}</span>
            <button
              onClick={resetFilters}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>

      {filteredDepartments.length === 0 ? (
        <p className="text-gray-500">Кафедры не найдены</p>
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
                  Внешний ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Факультет
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDepartments.map((dept) => (
                <tr key={dept.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dept.id || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dept.name || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dept.external_id || "—"}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    title={dept.faculty_id}
                  >
                    {dept.faculty_name || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/departments/${dept.id}`}
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
