import { apiFetch } from "../../apiFetch";
import Link from "next/link";
import { Teacher } from "../types";

export default async function TeacherPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let teacher: Teacher | null = null;

  try {
    const data = await apiFetch<Teacher>(`/v1/teachers/${id}`);
    teacher = data.response ?? null;
  } catch (error) {
    console.error("Error fetching teacher:", error);
  }

  if (!teacher) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">Преподаватель не найден</p>
        <Link href="/teachers" className="text-blue-600 hover:underline mt-4 inline-block">
          Вернуться к списку
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/teachers" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Назад к списку преподавателей
        </Link>
        <h1 className="text-3xl font-bold text-gray-500">
          Преподаватель: {teacher.name || id}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <dl className="grid grid-cols-1 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">ID</dt>
            <dd className="mt-1 text-sm text-gray-900">{teacher.id}</dd>
          </div>
          {teacher.name && (
            <div>
              <dt className="text-sm font-medium text-gray-500">ФИО</dt>
              <dd className="mt-1 text-sm text-gray-900">{teacher.name}</dd>
            </div>
          )}
          {teacher.external_id && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Внешний ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{teacher.external_id}</dd>
            </div>
          )}
          {teacher.position && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Должность</dt>
              <dd className="mt-1 text-sm text-gray-900">{teacher.position}</dd>
            </div>
          )}
          {teacher.degree && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Ученая степень</dt>
              <dd className="mt-1 text-sm text-gray-900">{teacher.degree}</dd>
            </div>
          )}
          {teacher.department_id && (
            <div>
              <dt className="text-sm font-medium text-gray-500">ID кафедры</dt>
              <dd className="mt-1 text-sm text-gray-900">{teacher.department_id}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}

