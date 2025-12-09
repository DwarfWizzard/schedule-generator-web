import { apiFetch } from "../../apiFetch";
import Link from "next/link";
import { EduPlan } from "../types";
import DeleteEduPlanButton from "./DeleteEduPlanButton";

export default async function EduPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let plan: EduPlan | null = null;

  try {
    const data = await apiFetch<EduPlan>(`/v1/edu-plans/${id}`);
    plan = data.response ?? null;
  } catch (error) {
    console.error("Error fetching edu plan:", error);
  }

  if (!plan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">Учебный план не найден</p>
        <Link href="/edu-plans" className="text-blue-600 hover:underline mt-4 inline-block">
          Вернуться к списку
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/edu-plans" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Назад к списку учебных планов
        </Link>
        <h1 className="text-3xl font-bold text-gray-500">
          Учебный план: {plan.profile || id}
        </h1>
      </div>

      <div className="mb-4">
        <DeleteEduPlanButton eduPlanId={id} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <dl className="grid grid-cols-1 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">ID</dt>
            <dd className="mt-1 text-sm text-gray-900">{plan.id}</dd>
          </div>
          {plan.profile && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Профиль</dt>
              <dd className="mt-1 text-sm text-gray-900">{plan.profile}</dd>
            </div>
          )}
          {plan.year && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Год</dt>
              <dd className="mt-1 text-sm text-gray-900">{plan.year}</dd>
            </div>
          )}
          {plan.direction_id && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Направление / ID направления</dt>
              <dd className="mt-1 text-sm text-gray-900">{plan.direction_name} / {plan.direction_id}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}

