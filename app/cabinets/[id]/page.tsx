import { apiFetchServer } from "../../apiFetch";
import Link from "next/link";
import { Cabinet, cabinetTypeLabels } from "../types";
import DeleteCabinetButton from "./DeleteCabinetButton";

export default async function CabinetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let cabinet: Cabinet | null = null;

  try {
    const data = await apiFetchServer<Cabinet>(`/v1/cabinets/${id}`);
    cabinet = data.response ?? null;
  } catch (error) {
    console.error("Error fetching cabinet:", error);
  }

  if (!cabinet) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">Кабинет не найден</p>
        <Link href="/cabinets" className="text-blue-600 hover:underline mt-4 inline-block">
          Вернуться к списку
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/cabinets" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Назад к списку кабинетов
        </Link>
        <h1 className="text-3xl font-bold text-gray-500">
          Кабинет: {cabinet.building}-{cabinet.auditorium}
        </h1>
      </div>

      <div className="mb-4 flex gap-2">
        <Link
          href={`/cabinets/${id}/edit`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition inline-block"
        >
          Редактировать
        </Link>
        <DeleteCabinetButton cabinetId={id} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <dl className="grid grid-cols-1 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">ID</dt>
            <dd className="mt-1 text-sm text-gray-900">{cabinet.id}</dd>
          </div>
          {cabinet.building && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Кабинет</dt>
              <dd className="mt-1 text-sm text-gray-900">{cabinet.building}-{cabinet.auditorium}</dd>
            </div>
          )}
          {cabinet.type && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Тип</dt>
              <dd className="mt-1 text-sm text-gray-900">{cabinetTypeLabels[cabinet.type]}</dd>
            </div>
          )}
          {cabinet.suitable_for_peoples_with_special_needs && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Приспособленность для использования инвалидами и лицами с ОВЗ для учебного кабинета</dt>
              <dd className="mt-1 text-sm text-gray-900">{cabinet.suitable_for_peoples_with_special_needs ? "Да" : "Нет"}</dd>
            </div>
          )}
          {cabinet.appointment && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Назначение</dt>
              <dd className="mt-1 text-sm text-gray-900">{cabinet.appointment}</dd>
            </div>
          )}
          {cabinet.equipment && (
            <div className="mt-2">
              <dt className="text-sm font-medium text-gray-500">Оснащение</dt>
              <dd className="text-xs space-y-1 mt-1">
                <div><span className="font-semibold text-gray-900">Учебная мебель</span>: {cabinet.equipment.furniture || "—"}</div>
                <div><span className="font-semibold text-gray-900">Технические средства</span>: {cabinet.equipment.technical_means || "—"}</div>
                <div><span className="font-semibold text-gray-900">Компьютерная техника</span>: {cabinet.equipment.computer_equipment || "—"}</div>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}

