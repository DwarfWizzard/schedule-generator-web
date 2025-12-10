"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handleApiResponse, formatApiError } from "../../utils/api";
import { apiFetchClient, getPublicApiBaseUrl } from "@/app/apiFetch";
import { EduGroup } from "@/app/edu-groups/types";

export default function NewSchedule() {
  const router = useRouter();
  const [eduGroupID, setEduGroupId] = useState("");
  const [semester, setSemester] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [eduGroups, setEduGroups] = useState<EduGroup[]>([])
    
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${getPublicApiBaseUrl()}/v1/schedules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          edu_group_id: eduGroupID,
          semester: semester,
          start_date: startDate,
          end_date: endDate,
        }),
      });

      await handleApiResponse(response);

      router.push("/schedules");
      router.refresh();
    } catch (error) {
      alert("Ошибка: " + formatApiError(error));
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-500 mb-6">Новое расписание</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID учебной группы (UUID) <span className="text-red-500">*</span>
          </label>
          <select
            value={eduGroupID}
            onChange={(e) => setEduGroupId(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500"
          >
            <option value="">Выберите учебную группу</option>
            {eduGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.number} ({group.id})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Семестр
          </label>
          <input
            type="number"
            value={semester}
            onChange={(e) => setSemester(Number(e.target.value))}
            required
            min="1"
            max="12"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-500 placeholder-gray-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Дата начала расписания
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-500 placeholder-gray-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Дата окончания расписания
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-500 placeholder-gray-500"
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