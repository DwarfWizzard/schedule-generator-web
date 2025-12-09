"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl, handleApiResponse, formatApiError } from "../../utils/api";
import { EduPlan } from "@/app/edu-plans/types";
import { apiFetch } from "@/app/apiFetch";

export default function NewEduGroup() {
  const router = useRouter();
  const [number, setNumber] = useState("");
  const [eduPlanId, setEduPlanId] = useState("");
  const [loading, setLoading] = useState(false);
  const [eduPlans, setEduPlans] = useState<EduPlan[]>([])
    
  useEffect(() => {
    async function fetchEduPlans() {
      try {
        const data = await apiFetch<EduPlan[]>("/v1/edu-plans");
        setEduPlans(data.response || []);
      } catch (error) {
        console.error("Error fetching edu plans:", error);
      }
    }
    fetchEduPlans();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${getApiUrl()}/v1/edu-groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number,
          edu_plan_id: eduPlanId,
        }),
      });

      await handleApiResponse(response);

      router.push("/edu-groups");
      router.refresh();
    } catch (error) {
      alert("Ошибка: " + formatApiError(error));
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-500 mb-6">Новая учебная группа</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID учебного плана (UUID) <span className="text-red-500">*</span>
          </label>
          <select
            value={eduPlanId}
            onChange={(e) => setEduPlanId(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500"
          >
            <option value="">Выберете учебный план</option>
            {eduPlans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.direction_name}/{plan.profile || "--"} ({plan.id})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Номер группы <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-500 placeholder-gray-500"
            placeholder="Например: ИВТ-21-1"
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

