"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { handleApiResponse, formatApiError } from "../../../utils/api";
import { Cabinet, CabinetEquipment, CabinetType, cabinetTypeLabels } from "../../types";
import { apiFetchClient, getPublicApiBaseUrl } from "@/app/apiFetch";

export default function EditCabinet() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [cabinet, setCabinet] = useState<Cabinet | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showEquipment, setShowEquipment] = useState(false);

  useEffect(() => {
    async function fetchCabinet() {
      try {
        const data = await apiFetchClient<Cabinet>(`/v1/cabinets/${id}`);
        if (data.response) {
          setCabinet(data.response);
          setShowEquipment(!!data.response.equipment);
        }
      } catch (error) {
        alert("Ошибка загрузки данных: " + formatApiError(error));
        router.push("/cabinets");
      } finally {
        setFetching(false);
      }
    }

    fetchCabinet();
  }, [id, router]);

  const updateField = <K extends keyof Cabinet>(field: K, value: Cabinet[K]) => {
    setCabinet(prev => prev ? { ...prev, [field]: value } : null);
  };

  const updateEquipmentField = (field: keyof CabinetEquipment, value: string) => {
    setCabinet(prev => {
      if (!prev) return prev;
      
      const currentEquipment = prev.equipment;
      const newEquipment: CabinetEquipment = {
        furniture: currentEquipment?.furniture || '',
        technical_means: currentEquipment?.technical_means || '',
        computer_equipment: currentEquipment?.computer_equipment || '',
        [field]: value
      };

      return { ...prev, equipment: newEquipment };
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const body: any = {};

      // faculty_id
      if (cabinet?.faculty_id) {
        body.faculty_id = cabinet.faculty_id;
      }

      // cabinet_type (int8)
      if (cabinet?.type !== undefined && cabinet.type !== null && typeof cabinet.type === 'number') {
        body.cabinet_type = cabinet.type;
      }

      // type (string)
      if (cabinet?.type && typeof cabinet.type === 'string') {
        body.type = cabinet.type;
      }

      // building
      if (cabinet?.building) {
        body.building = cabinet.building;
      }

      // auditorium
      if (cabinet?.auditorium) {
        body.auditorium = cabinet.auditorium;
      }

      // suitable_for_peoples_with_special_needs
      if (cabinet?.suitable_for_peoples_with_special_needs !== undefined) {
        body.suitable_for_peoples_with_special_needs = cabinet.suitable_for_peoples_with_special_needs;
      }

      // appointment
      if (cabinet?.appointment) {
        body.appointment = cabinet.appointment;
      }

      // equipment
      if (cabinet?.equipment && showEquipment) {
        body.equipment = cabinet.equipment;
      }

      const response = await fetch(`${getPublicApiBaseUrl()}/v1/cabinets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      await handleApiResponse(response);
      router.push(`/cabinets/${id}`);
      router.refresh();
    } catch (error) {
      alert("Ошибка: " + formatApiError(error));
    } finally {
      setLoading(false);
    }
  }

  if (fetching || !cabinet) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link
          href={`/cabinets/${id}`}
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Назад к кабинету
        </Link>
        <h1 className="text-3xl font-bold text-gray-500">Редактировать кабинет</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        {/* Факультет (только для отображения) */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Факультет
          </label>
          <p className="text-gray-900 font-medium">{cabinet.faculty_name}</p>
          <p className="text-xs text-gray-500 mt-1">Не редактируется</p>
        </div>

        {/* Тип кабинета */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Тип кабинета <span className="text-red-500">*</span>
          </label>
          <select
            value={cabinet.type}
            onChange={(e) => updateField('type' as any, Number(e.target.value))}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-500 placeholder-gray-500"
          >
            <option value="">Выберите тип кабинета</option>
             {(Object.keys(cabinetTypeLabels) as unknown as CabinetType[]).map(
                (key) => (
                  <option key={key} value={key}>
                    {cabinetTypeLabels[key]}
                  </option>
                 )
              )}
          </select>
        </div>

        {/* Корпус */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Корпус <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={cabinet.building || ''}
            onChange={(e) => updateField('building' as any, e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-500 placeholder-gray-500"
            placeholder="Введите корпус"
            required
          />
        </div>

        {/* Кабинет */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Кабинет <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={cabinet.auditorium || ''}
            onChange={(e) => updateField('auditorium' as any, e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-500 placeholder-gray-500"
            placeholder="Введите номер аудитории"
            required
          />
        </div>

        {/* Доступность */}
        <div className="mb-6">
          <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <input
              type="checkbox"
              checked={cabinet.suitable_for_peoples_with_special_needs || false}
              onChange={(e) => updateField('suitable_for_peoples_with_special_needs' as any, e.target.checked)}
              className="rounded border-gray-300 text-red-500 focus:ring-red-500 h-4 w-4"
            />
            <span className="text-sm font-medium text-gray-700">
              Приспособленность для использования инвалидами и лицами с ОВЗ для учебного кабинета
            </span>
          </label>
        </div>

        {/* Назначение */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Назначение
          </label>
          <input
            type="text"
            value={cabinet.appointment || ''}
            onChange={(e) => updateField('appointment' as any, e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-500 placeholder-gray-500"
            placeholder="Введите назначение"
          />
        </div>

        {/* Оснащенность */}
        <div className="mb-6">
          <label className="flex items-center space-x-2 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={showEquipment}
              onChange={(e) => {
                setShowEquipment(e.target.checked);
                if (!e.target.checked) {
                  updateField('equipment' as any, null);
                }
              }}
              className="rounded border-gray-300 text-red-500 focus:ring-red-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Указать оснащенность кабинета
            </span>
          </label>

          {showEquipment && (
            <div className="space-y-4 pt-4 border-t border-gray-200 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Мебель <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cabinet.equipment?.furniture || ''}
                  onChange={(e) => updateEquipmentField('furniture', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-500 placeholder-gray-500"
                  placeholder="Опишите мебель"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Технические средства <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cabinet.equipment?.technical_means || ''}
                  onChange={(e) => updateEquipmentField('technical_means', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-500 placeholder-gray-500"
                  placeholder="Проектор, интерактивная доска и т.д."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Компьютерная техника <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cabinet.equipment?.computer_equipment || ''}
                  onChange={(e) => updateEquipmentField('computer_equipment', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-500 placeholder-gray-500"
                  placeholder="Компьютеры, ноутбуки и т.д."
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* Кнопки */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50 flex-1"
          >
            {loading ? "Сохранение..." : "Сохранить"}
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
