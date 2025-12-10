import { apiFetchServer } from "../../apiFetch";
import Link from "next/link";
import { EduGroup } from "../types";
import DeleteEduGroupButton from "./DeleteEduGroupButton";

export default async function EduGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let group: EduGroup | null = null;

  try {
    const data = await apiFetchServer<EduGroup>(`/v1/edu-groups/${id}`);
    group = data.response ?? null;
  } catch (error) {
    console.error("Error fetching edu group:", error);
  }

  if (!group) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">Учебная группа не найдена</p>
        <Link href="/edu-groups" className="text-blue-600 hover:underline mt-4 inline-block">
          Вернуться к списку
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/edu-groups" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Назад к списку групп
        </Link>
        <h1 className="text-3xl font-bold text-gray-500">
          Учебная группа: {group.number || id}
        </h1>
      </div>

      <div className="mb-4 flex gap-2">
        <Link
          href={`/edu-groups/${id}/edit`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition inline-block"
        >
          Редактировать
        </Link>
        <DeleteEduGroupButton eduGroupId={id} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <dl className="grid grid-cols-1 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">ID</dt>
            <dd className="mt-1 text-sm text-gray-900">{group.id}</dd>
          </div>
          {group.number && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Номер группы</dt>
              <dd className="mt-1 text-sm text-gray-900">{group.number}</dd>
            </div>
          )}
          {group.profile && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Профиль</dt>
              <dd className="mt-1 text-sm text-gray-900">{group.profile}</dd>
            </div>
          )}
          {group.admission_year && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Год поступления</dt>
              <dd className="mt-1 text-sm text-gray-900">{group.admission_year}</dd>
            </div>
          )}
          {group.edu_plan_id && (
            <div>
              <dt className="text-sm font-medium text-gray-500">ID учебного плана</dt>
              <dd className="mt-1 text-sm text-gray-900">{group.edu_plan_id}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}

