"use client";

import Link from "next/link";
import { apiFetchClient } from "../lib/apiFetch";
import { EduPlan } from "./types";
import { useEffect, useMemo, useRef, useState } from "react";

export default function EduPlansPage() {
  const [plans, setEduPlans] = useState<EduPlan[]>([]);

  const [profileFilter, setProfileFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [directionFilter, setDirectionFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const topScrollRef = useRef<HTMLDivElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const [tableScrollWidth, setTableScrollWidth] = useState(0);

  useEffect(() => {
    async function fetchEduPlans() {
      try {
        const data = await apiFetchClient<EduPlan[]>("/v1/edu-plans");
        setEduPlans(data.response || []);
      } catch (error) {
        console.error("Error fetching edu plans:", error);
      }
    }
    fetchEduPlans();
  }, []);

  const uniqueYears = useMemo(() => {
    const years = plans.map((p) => String(p.year || "")).filter(Boolean);
    return Array.from(new Set(years)).sort();
  }, [plans]);

  const uniqueDirections = useMemo(() => {
    const dirs = plans
      .map((p) => p.direction_name)
      .filter((d): d is string => Boolean(d));
    return Array.from(new Set(dirs));
  }, [plans]);

  const uniqueDepartments = useMemo(() => {
    const depts = plans
      .map((p) => p.department_name)
      .filter((d): d is string => Boolean(d));
    return Array.from(new Set(depts));
  }, [plans]);

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const matchProfile = (plan.profile || "")
        .toLowerCase()
        .includes(profileFilter.toLowerCase().trim());
      const matchYear = String(plan.year || "")
        .toLowerCase()
        .includes(yearFilter.toLowerCase().trim());
      const matchDirection = (plan.direction_name || "")
        .toLowerCase()
        .includes(directionFilter.toLowerCase().trim());
      const matchDepartment = (plan.department_name || "")
        .toLowerCase()
        .includes(departmentFilter.toLowerCase().trim());

      return matchProfile && matchYear && matchDirection && matchDepartment;
    });
  }, [plans, profileFilter, yearFilter, directionFilter, departmentFilter]);

  useEffect(() => {
    const updateWidth = () => {
      if (tableRef.current) {
        setTableScrollWidth(tableRef.current.scrollWidth);
      }
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    if (tableRef.current) {
      observer.observe(tableRef.current);
    }

    window.addEventListener("resize", updateWidth);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, [filteredPlans]);

  const handleTopScroll = () => {
    if (topScrollRef.current && tableContainerRef.current) {
      if (
        tableContainerRef.current.scrollLeft !== topScrollRef.current.scrollLeft
      ) {
        tableContainerRef.current.scrollLeft = topScrollRef.current.scrollLeft;
      }
    }
  };

  const handleTableScroll = () => {
    if (topScrollRef.current && tableContainerRef.current) {
      if (
        topScrollRef.current.scrollLeft !== tableContainerRef.current.scrollLeft
      ) {
        topScrollRef.current.scrollLeft = tableContainerRef.current.scrollLeft;
      }
    }
  };

  const resetFilters = () => {
    setProfileFilter("");
    setYearFilter("");
    setDirectionFilter("");
    setDepartmentFilter("");
  };

  const hasActiveFilters = Boolean(
    profileFilter || yearFilter || directionFilter || departmentFilter
  );

  const topDummyStyle = {
    width: tableScrollWidth ? `${tableScrollWidth}px` : "100%",
    height: "12px",
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-500">Учебные планы</h1>
        <Link
          href="/edu-plans/new"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
        >
          Добавить учебный план
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
              Профиль
            </label>
            <input
              type="text"
              value={profileFilter}
              onChange={(e) => setProfileFilter(e.target.value)}
              placeholder="Поиск по профилю..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
              Год
            </label>
            <input
              type="text"
              value={yearFilter}
              autoComplete="off"
              onChange={(e) => setYearFilter(e.target.value)}
              placeholder="Введите год..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <datalist id="plan-years-list">
              {uniqueYears.map((year) => (
                <option key={year} value={year} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
              Направление подготовки
            </label>
            <input
              type="text"
              value={directionFilter}
              autoComplete="off"
              onChange={(e) => setDirectionFilter(e.target.value)}
              placeholder="Введите направление..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <datalist id="plan-directions-list">
              {uniqueDirections.map((dir) => (
                <option key={dir} value={dir} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
              Кафедра
            </label>
            <input
              type="text"
              value={departmentFilter}
              autoComplete="off"
              onChange={(e) => setDepartmentFilter(e.target.value)}
              placeholder="Введите кафедру..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <datalist id="plan-departments-list">
              {uniqueDepartments.map((dept) => (
                <option key={dept} value={dept} />
              ))}
            </datalist>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
            <span>Найдено записей: {filteredPlans.length}</span>
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

      {filteredPlans.length === 0 ? (
        <p className="text-gray-500">Учебные планы не найдены</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div
            ref={topScrollRef}
            onScroll={handleTopScroll}
            className="overflow-x-auto border-b border-gray-200 bg-gray-50"
          >
            <div style={topDummyStyle} />
          </div>

          <div
            ref={tableContainerRef}
            onScroll={handleTableScroll}
            className="overflow-x-auto"
          >
            <table ref={tableRef} className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Профиль
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Год
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Направление подготовки
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Кафедра
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {plan.profile || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {plan.year || "—"}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      title={plan.direction_id}
                    >
                      {plan.direction_name || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {plan.department_name || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/edu-plans/${plan.id}`}
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
