"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { EduPlan } from "../../types";
import { apiFetchClient, formatApiError, getPublicApiBaseUrl } from "@/app/lib/apiFetch";
import { EduDirection } from "@/app/edu-directions/types";
import { Department } from "@/app/departments/types";

export default function EditEduPlan() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [profile, setName] = useState("");
  const [year, setYear] = useState(1900);
  const [directionId, setDirectionId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [eduDirections, setEduDirections] = useState<EduDirection[]>([])
  const [departments, setDepartments] = useState<Department[]>([])

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

  useEffect(() => {
    async function fetchEduPlan() {
      try {
        const data = await apiFetchClient<EduPlan>(`/v1/edu-plans/${id}`);  
        if (data.response) {
          setName(data.response.profile || "");
          setYear(data.response.year || 1900);
          setDirectionId(data.response.direction_id || "");
          setDepartmentId(data.response.department_id || "");
        }
      } catch (error) {
        alert("Ошибка загрузки данных: " + formatApiError(error));
        router.push("/edu-plans");
      } finally {
        setFetching(false);
      }
    }

    fetchEduPlan();
  }, [id, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const body: {profile?: string, year?: number, direction_id?:string, department_id?:string} = {};
      
      if (profile) {
        body.profile = profile;
      }

      if (year) {
        body.year = year;
      }

      if (directionId) {
        body.direction_id = directionId;
      }

      if (departmentId) {
        body.department_id = departmentId;
      }

      const response = await apiFetchClient(`/v1/edu-plans/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      router.push(`/edu-plans/${id}`);
      router.refresh();
    } catch (error) {
      alert("Ошибка: " + formatApiError(error));
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link
          href={`/edu-plans/${id}`}
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Назад к направлению
        </Link>
        <h1 className="text-3xl font-bold text-gray-500">Редактировать направление подготовки</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID направления подготовки (UUID) <span className="text-red-500">*</span>
          </label>
          <select
            value={directionId}
            onChange={(e) => setDirectionId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500"
          >
            <option value="">Выберите направление подготовки</option>
            {eduDirections.map((dir) => (
              <option key={dir.id} value={dir.id}>
                {dir.name} ({dir.id})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID кафедры (UUID) <span className="text-red-500">*</span>
          </label>
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500"
          >
            <option value="">Выберите кафедру</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name} ({department.id})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Профиль
          </label>
          <input
            type="text"
            value={profile}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500 placeholder-gray-500"
            placeholder="Введите профиль подготовки"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Сохранение..." : "Сохранить"}
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

