import { apiFetchServer } from "../../apiFetch";
import Link from "next/link";
import { Department } from "../types";
import DeleteDepartmentButton from "./DeleteDepartmentButton";

export default async function DepartmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let department: Department | null = null;

  try {
    const data = await apiFetchServer<Department>(`/v1/departments/${id}`);
    department = data.response ?? null;
  } catch (error) {
    console.error("Error fetching department:", error);
  }

  if (!department) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">Кафедра не найдена</p>
        <Link href="/departments" className="text-blue-600 hover:underline mt-4 inline-block">
          Вернуться к списку
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/departments" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Назад к списку кафедр
        </Link>
        <h1 className="text-3xl font-bold text-gray-500">Кафедра: {department.name || id}</h1>
      </div>

      <div className="mb-4 flex gap-2">
        <Link
          href={`/departments/${id}/edit`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition inline-block"
        >
          Редактировать
        </Link>
        <DeleteDepartmentButton departmentId={id} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <dl className="grid grid-cols-1 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">ID</dt>
            <dd className="mt-1 text-sm text-gray-900">{department.id}</dd>
          </div>
          {department.name && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Название</dt>
              <dd className="mt-1 text-sm text-gray-900">{department.name}</dd>
            </div>
          )}
          {department.external_id && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Внешний ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{department.external_id}</dd>
            </div>
          )}
          {department.faculty_id && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Факультет / ID факультета</dt>
              <dd className="mt-1 text-sm text-gray-900">{department.faculty_name} / {department.faculty_id}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}

