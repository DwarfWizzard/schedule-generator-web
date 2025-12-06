"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getApiUrl, handleApiResponse, formatApiError } from "../../../utils/api";

export default function AddScheduleItem() {
  const router = useRouter();
  const params = useParams();
  const scheduleId = params.id as string;

  const [weekday, setWeekday] = useState(1);
  const [lessonNumber, setLessonNumber] = useState(1);
  const [discipline, setDiscipline] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [loading, setLoading] = useState(false);

  const weekdays = [
    { value: 1, label: "Понедельник" },
    { value: 2, label: "Вторник" },
    { value: 3, label: "Среда" },
    { value: 4, label: "Четверг" },
    { value: 5, label: "Пятница" },
    { value: 6, label: "Суббота" },
    { value: 7, label: "Воскресенье" },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${getApiUrl()}/v1/schedules/${scheduleId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekday,
          lesson_number: lessonNumber,
          discipline,
          teacher_id: teacherId || undefined,
        }),
      });

      await handleApiResponse(response);

      router.push(`/schedules/${scheduleId}`);
      router.refresh();
    } catch (error) {
      alert("Ошибка: " + formatApiError(error));
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link
          href={`/schedules/${scheduleId}`}
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Назад к расписанию
        </Link>
        <h1 className="text-3xl font-bold text-gray-500">Добавить занятие</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            День недели
          </label>
          <select
            value={weekday}
            onChange={(e) => setWeekday(Number(e.target.value))}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {weekdays.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Номер пары
          </label>
          <input
            type="number"
            value={lessonNumber}
            onChange={(e) => setLessonNumber(Number(e.target.value))}
            required
            min="1"
            max="10"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Предмет
          </label>
          <input
            type="text"
            value={discipline}
            onChange={(e) => setDiscipline(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Введите название предмета"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID преподавателя (опционально)
          </label>
          <input
            type="text"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="UUID преподавателя"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Добавление..." : "Добавить"}
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

