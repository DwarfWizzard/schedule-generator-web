"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl, handleApiResponse, formatApiError } from "../../utils/api";
import { Department } from "@/app/departments/types";
import { apiFetch } from "@/app/apiFetch";

export default function NewEducationDirection() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([])

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const data = await apiFetch<Department[]>("/v1/departments");
        setDepartments(data.response || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    }
    fetchDepartments();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${getApiUrl()}/v1/edu-directions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          department_id: departmentId,
        }),
      });

      await handleApiResponse(response);

      router.push("/edu-directions");
      router.refresh();
    } catch (error) {
      alert("Ошибка: " + formatApiError(error));
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-500 mb-6">Новое направление подготовки</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID кафедры (UUID) <span className="text-red-500">*</span>
          </label>
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500"
          >
            <option value="">Выберете кафедру</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name} ({department.id})
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Название направления <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500 placeholder-gray-500"
            placeholder="Введите название направления"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Создание..." : "Создать"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

