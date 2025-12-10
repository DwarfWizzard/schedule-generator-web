"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handleApiResponse, formatApiError } from "../../utils/api";
import { EduDirection } from "@/app/edu-directions/types";
import { apiFetchClient, getPublicApiBaseUrl } from "@/app/apiFetch";

export default function NewEduPlan() {
  const router = useRouter();
  const [directionId, setDirectionId] = useState("");
  const [profile, setProfile] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [eduDirections, setEduDirections] = useState<EduDirection[]>([])
  
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${getPublicApiBaseUrl()}/v1/edu-plans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          direction_id: directionId,
          profile,
          year,
        }),
      });

      await handleApiResponse(response);

      router.push("/edu-plans");
      router.refresh();
    } catch (error) {
      alert("Ошибка: " + formatApiError(error));
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-500 mb-6">Новый учебный план</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID направления подготовки (UUID) <span className="text-red-500">*</span>
          </label>
          <select
            value={directionId}
            onChange={(e) => setDirectionId(e.target.value)}
            required
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
            Профиль <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-500 placeholder-gray-500"
            placeholder="Введите профиль учебного плана"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Год <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            required
            min="2000"
            max="2100"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-500 placeholder-gray-500"
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

