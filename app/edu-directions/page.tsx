import Link from "next/link";
import { apiFetch } from "../apiFetch";
import { EduDirection } from "./types";

export default async function EducationDirectionsPage() {
  let directions: EduDirection[] = [];
  
  try {
    const data = await apiFetch<EduDirection[]>("/v1/edu-directions");
    directions = data.response ?? [];
  } catch (error) {
    console.error("Error fetching education directions:", error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-500">Направления подготовки</h1>
        <Link
          href="/edu-directions/new"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
        >
          Добавить направление
        </Link>
      </div>

      {directions.length === 0 ? (
        <p className="text-gray-500">Направления не найдены</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Название
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Кафедра
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {directions.map((dir) => (
                <tr key={dir.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dir.id || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dir.name || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" title={dir.department_id}>
                    {dir.department_name || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/edu-directions/${dir.id}`}
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

