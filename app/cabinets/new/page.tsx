"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handleApiResponse, formatApiError } from "../../utils/api";
import { Faculty } from "@/app/faculties/types";
import { apiFetchClient, getPublicApiBaseUrl } from "@/app/apiFetch";
import { CabinetEquipment, CabinetType, cabinetTypeLabels } from "../types";

export default function Newcabinet() {
  const router = useRouter();
  const [facultyId, setFacultyId] = useState("");
  const [cabinetType, setCabinetType] = useState(CabinetType.mixed);
  const [building, setBuilding] = useState("");
  const [auditorium, setAuditorium] = useState("");
  const [suitableForPeoplesWithSpecialNeeds, setSuitableForPeoplesWithSpecialNeeds] = useState(false);
  const [appointment, setAppointment] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<CabinetEquipment | null>(null);
  const [showEquipmentFields, setShowEquipmentFields] = useState(false);
  const [loading, setLoading] = useState(false);
  const [faculties, setFacultys] = useState<Faculty[]>([])
  
  useEffect(() => {
    async function fetchFacultys() {
      try {
        const data = await apiFetchClient<Faculty[]>("/v1/faculties");
        setFacultys(data.response || []);
      } catch (error) {
        console.error("Error fetching faculties:", error);
      }
    }
    fetchFacultys();
  }, []);

  const updateEquipmentField = (field: keyof CabinetEquipment, value: string) => {
  setEquipment(prev => {
      if (!prev) {
        return {
          furniture: '',
          technical_means: '',
          computer_equipment: '',
          [field]: value
        } as CabinetEquipment;
      }
      return { ...prev, [field]: value };
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${getPublicApiBaseUrl()}/v1/cabinets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          faculty_id: facultyId,
          cabinet_type: cabinetType, 
          building: building,
          auditorium: auditorium,
          suitable_for_peoples_with_special_needs: suitableForPeoplesWithSpecialNeeds,
          appointment: appointment,
          equipment: equipment
        }),
      });

      await handleApiResponse(response);

      router.push("/cabinets");
      router.refresh();
    } catch (error) {
      alert("Ошибка: " + formatApiError(error));
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-500 mb-6">Новый кабинет</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Факультет <span className="text-red-500">*</span>
          </label>
          <select
            value={facultyId}
            onChange={(e) => setFacultyId(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500"
          >
            <option value="">Выберите факультет</option>
            {faculties.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>
                {faculty.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Тип кабинета <span className="text-red-500">*</span>
          </label>
          <select
            value={cabinetType}
            onChange={(e) => setCabinetType(Number(e.target.value))}
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

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Корпус <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-500 placeholder-gray-500"
            placeholder="Введите корпус"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Кабинет <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={auditorium}
            onChange={(e) => setAuditorium(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-500 placeholder-gray-500"
            placeholder="Введите номер кабинет"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Приспособленность для использования инвалидами и лицами с ОВЗ для учебного кабинета <span className="text-red-500">*</span>
          </label>
          <input
            type="checkbox"
            id="suitableForSpecialNeeds"
            checked={suitableForPeoplesWithSpecialNeeds}
            required={false}
            onChange={(e) => setSuitableForPeoplesWithSpecialNeeds(e.target.checked)}
            className="rounded border-gray-300 text-red-500 focus:ring-red-500 h-4 w-4"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Назначение <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={appointment || ""}
            onChange={(e) => setBuilding(e.target.value)}
            required={false}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-500 placeholder-gray-500"
            placeholder="Укажите назначение кабинета (необязательно)"
          />
        </div>

        <div className="space-y-4">
          {/* Чекбокс для показа inputs */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showEquipmentFields}
              onChange={(e) => setShowEquipmentFields(e.target.checked)}
              required={false}
              className="rounded border-gray-300 text-red-500 focus:ring-red-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Указать оснащенность кабинета
            </span>
          </label>

          {/* Conditional inputs */}
          {showEquipmentFields && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Мебель <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={equipment?.furniture || ''}
                  onChange={(e) => updateEquipmentField('furniture', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Опишите мебель"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Технические средства <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={equipment?.technical_means || ''}
                  onChange={(e) => updateEquipmentField('technical_means', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Проектор, интерактивная доска и т.д."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Компьютерная техника <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={equipment?.computer_equipment || ''}
                  onChange={(e) => updateEquipmentField('computer_equipment', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Компьютеры, ноутбуки и т.д."
                />
              </div>
            </div>
          )}
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

