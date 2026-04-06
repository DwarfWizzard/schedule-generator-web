"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  SchedulePractice,
  SchedulePracticeType,
  schedulePracticeTypeLables,
} from "../../types";
import { apiFetchClient, formatApiError } from "@/app/lib/apiFetch";

export default function AddPracticePage({
  scheduleId,
  practice,
  onSuccess,
  onCancel,
}: {
  scheduleId: string;
  practice?: SchedulePractice;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const router = useRouter();

  const [type, setType] = useState<SchedulePracticeType>(
    practice ? practice.practice_type : SchedulePracticeType.educational
  );

  const [startDate, setStartDate] = useState(
    practice ? practice.start_date : ""
  );

  const [endDate, setEndDate] = useState(
    practice ? practice.end_date : ""
  );

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = [{
        practice_type: Number(type),
        start_date: startDate,
        end_date: endDate,
      }];

      await apiFetchClient(`/v1/schedules/${scheduleId}/practices`, {
        method: !practice ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (onSuccess) {
        onSuccess();
      }

      router.push(`/schedules/${scheduleId}`);
      router.refresh();
    } catch (error) {
      alert("Ошибка: " + formatApiError(error));
      setLoading(false);
    }
  }

  const isFormValid =
    type !== undefined &&
    startDate.length > 0 &&
    endDate.length > 0 &&
    new Date(startDate) <= new Date(endDate);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      
      {/* Тип практики */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Вид практики
        </label>

        <select
          value={type}
          onChange={(e) => setType(Number(e.target.value))}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 text-gray-500"
        >
          {(Object.keys(schedulePracticeTypeLables) as unknown as SchedulePracticeType[]).map(
            (key) => (
              <option key={key} value={key}>
                {schedulePracticeTypeLables[key]}
              </option>
            )
          )}
        </select>
      </div>

      {/* Дата начала */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Дата начала
        </label>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="w-full border border-gray-300 text-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Дата окончания */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Дата окончания
        </label>

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          className="w-full border border-gray-300 text-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Кнопки */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading
            ? practice
              ? "Обновление..."
              : "Добавление..."
            : practice
            ? "Обновить"
            : "Добавить"}
        </button>

        <button
          type="button"
          onClick={() => {
            if (onCancel) onCancel();
            router.back();
          }}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}