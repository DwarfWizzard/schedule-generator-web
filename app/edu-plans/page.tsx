import Link from "next/link";
import { apiFetch } from "../apiFetch";
import { EduPlan } from "./types";
import { EduDirection } from "../edu-directions/types";

export default async function EduPlansPage() {
  let plans: EduPlan[] = [];
  let directions: EduDirection[] = [];

  try {
    const data = await apiFetch<EduPlan[]>("/v1/edu-plans");
    plans = data.response ?? [];
  } catch (error) {
    console.error("Error fetching edu plans:", error);
  }

  const dirIds = [...new Set(plans.map(p => p.direction_id))];
  
  try {
    const params = new URLSearchParams();
    dirIds.forEach(id => params.append("ids", id));

    const data = await apiFetch<EduDirection[]>(`/v1/edu-directions?${params}`);
    directions = data.response ?? [];
  }catch (error) {
    console.error("Error fetching directions:", error);
  }

  const dirMap = new Map(directions.map(d => [d.id, d]));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-500">Учебные планы</h1>
        <Link
          href="/edu-plans/new"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
        >
          Добавить учебный план
        </Link>
      </div>

      {plans.length === 0 ? (
        <p className="text-gray-500">Учебные планы не найдены</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
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
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {plan.id || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {plan.profile || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {plan.year || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" title={plan.direction_id}>
                    {dirMap.get(plan.direction_id)?.name || "—"}
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
      )}
    </div>
  );
}

