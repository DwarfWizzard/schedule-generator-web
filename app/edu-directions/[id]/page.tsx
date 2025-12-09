import { apiFetch } from "../../apiFetch";
import Link from "next/link";
import { EduDirection } from "../types";
import DeleteEduDirectionButton from "./DeleteEduDirectionButton";

export default async function EducationDirectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let direction: EduDirection | null = null;

  try {
    const data = await apiFetch<EduDirection>(`/v1/edu-directions/${id}`);
    direction = data.response ?? null;
  } catch (error) {
    console.error("Error fetching education direction:", error);
  }

  if (!direction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">Направление не найдено</p>
        <Link href="/edu-directions" className="text-blue-600 hover:underline mt-4 inline-block">
          Вернуться к списку
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/edu-directions" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Назад к списку направлений
        </Link>
        <h1 className="text-3xl font-bold text-gray-500">
          Направление: {direction.name || id}
        </h1>
      </div>

      <div className="mb-4 flex gap-2">
        <Link
          href={`/edu-directions/${id}/edit`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition inline-block"
        >
          Редактировать
        </Link>
        <DeleteEduDirectionButton eduDirectionId={id} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <dl className="grid grid-cols-1 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">ID</dt>
            <dd className="mt-1 text-sm text-gray-900">{direction.id}</dd>
          </div>
          {direction.name && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Название</dt>
              <dd className="mt-1 text-sm text-gray-900">{direction.name}</dd>
            </div>
          )}
          {direction.department_id && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Кафедра / ID кафедры</dt>
              <dd className="mt-1 text-sm text-gray-900">{direction.department_name} / {direction.department_id}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}

