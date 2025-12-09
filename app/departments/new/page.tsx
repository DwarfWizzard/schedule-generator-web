"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl, handleApiResponse, formatApiError } from "../../utils/api";
import { Faculty } from "@/app/faculties/types";
import { apiFetch } from "@/app/apiFetch";

export default function NewDepartment() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [externalId, setExternalId] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [loading, setLoading] = useState(false);
  const [faculties, setFaculties] = useState<Faculty[]>([])
      
  useEffect(() => {
    async function fetchFaculties() {
      try {
        const data = await apiFetch<Faculty[]>("/v1/faculties");
        setFaculties(data.response || []);
      } catch (error) {
        console.error("Error fetching faculties:", error);
      }
    }
    fetchFaculties();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const body: {name: string; external_id?: string; faculty_id?: string} = { name: name };
      
      if (externalId) {
        body.external_id = externalId;
      }
      
      if (facultyId) {
        body.faculty_id = facultyId;
      }

      const response = await fetch(`${getApiUrl()}/v1/departments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      await handleApiResponse(response);

      router.push("/departments");
      router.refresh();
    } catch (error) {
      alert("Ошибка: " + formatApiError(error));
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-500 mb-6">Новая кафедра</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID факультета (UUID)
          </label>
          <select
            value={facultyId}
            onChange={(e) => setFacultyId(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500"
          >
            <option value="">Выберете кафедру</option>
            {faculties.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>
                {faculty.name} ({faculty.id})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Название кафедры <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500 placeholder-gray-500"
            placeholder="Введите название кафедры"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Внешний ID
          </label>
          <input
            type="text"
            value={externalId}
            onChange={(e) => setExternalId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500 placeholder-gray-500"
            placeholder="Введите внешний идентификатор"
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

