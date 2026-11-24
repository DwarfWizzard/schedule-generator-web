"use client";

import Link from "next/link";
import { apiFetchClient } from "../lib/apiFetch";
import { EduGroup } from "./types";
import { useEffect, useMemo, useState } from "react";

export default function EduGroupsPage() {
  const [groups, setEduGroups] = useState<EduGroup[]>([]);

  const [idFilter, setIdFilter] = useState("");
  const [numberFilter, setNumberFilter] = useState("");
  const [profileFilter, setProfileFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  useEffect(() => {
    async function fetchEduGroups() {
      try {
        const data = await apiFetchClient<EduGroup[]>("/v1/edu-groups");
        setEduGroups(data.response || []);
      } catch (error) {
        console.error("Error fetching edu groups:", error);
      }
    }
    fetchEduGroups();
  }, []);

  const uniqueProfiles = useMemo(() => {
    const profiles = groups
      .map((g) => g.profile)
      .filter((p): p is string => Boolean(p));
    return Array.from(new Set(profiles));
  }, [groups]);

  const uniqueYears = useMemo(() => {
    const years = groups
      .map((g) => String(g.admission_year || ""))
      .filter(Boolean);
    return Array.from(new Set(years)).sort();
  }, [groups]);

  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      const matchId = String(group.id || "")
        .toLowerCase()
        .includes(idFilter.toLowerCase().trim());
      const matchNumber = (group.number || "")
        .toLowerCase()
        .includes(numberFilter.toLowerCase().trim());
      const matchProfile = (group.profile || "")
        .toLowerCase()
        .includes(profileFilter.toLowerCase().trim());
      const matchYear = String(group.admission_year || "")
        .toLowerCase()
        .includes(yearFilter.toLowerCase().trim());

      return matchId && matchNumber && matchProfile && matchYear;
    });
  }, [groups, idFilter, numberFilter, profileFilter, yearFilter]);

  const resetFilters = () => {
    setIdFilter("");
    setNumberFilter("");
    setProfileFilter("");
    setYearFilter("");
  };

  const hasActiveFilters = Boolean(
    idFilter || numberFilter || profileFilter || yearFilter
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-500">Учебные группы</h1>
        <Link
          href="/edu-groups/new"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
        >
          Добавить группу
        </Link>
      </div>

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
              Номер группы
            </label>
            <input
              type="text"
              value={numberFilter}
              onChange={(e) => setNumberFilter(e.target.value)}
              placeholder="Например, ИВТ-101..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
              Профиль
            </label>
            <input
              type="text"
              value={profileFilter}
              onChange={(e) => setProfileFilter(e.target.value)}
              placeholder="Введите профиль..."
              autoComplete="off"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <datalist id="group-profiles-list">
              {uniqueProfiles.map((profile) => (
                <option key={profile} value={profile} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
              Год поступления
            </label>
            <input
              type="text"
              value={yearFilter}
              autoComplete="off"
              onChange={(e) => setYearFilter(e.target.value)}
              placeholder="Введите год..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <datalist id="group-years-list">
              {uniqueYears.map((year) => (
                <option key={year} value={year} />
              ))}
            </datalist>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
            <span>Найдено записей: {filteredGroups.length}</span>
            <button
              type="button"
              onClick={resetFilters}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>

      {filteredGroups.length === 0 ? (
        <p className="text-gray-500">Учебные группы не найдены</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Номер группы
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Профиль
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Год поступления
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGroups.map((group) => (
                <tr key={group.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {group.id || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {group.number || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {group.profile || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {group.admission_year || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/edu-groups/${group.id}`}
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
