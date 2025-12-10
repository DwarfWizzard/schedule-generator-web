"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { handleApiResponse, formatApiError } from "../../../utils/api";
import { ScheduleItemLectureType, scheduleItemLectureTypeLabels, ScheduleItemWeektype, scheduleItemWeektypeLabels } from "../../types";
import { apiFetchClient, getPublicApiBaseUrl } from "@/app/apiFetch";
import { Teacher } from "@/app/teachers/types";

export default function AddScheduleItem() {
  const router = useRouter();
  const params = useParams();
  const scheduleId = params.id as string;

  const [weekday, setWeekday] = useState(1);
  const [studentsCount, setStudentsCount] = useState(0);
  const [lessonNumber, setLessonNumber] = useState(0);
  const [subgroup, setSubgroup] = useState(0);
  const [weektype, setWeektype] = useState(ScheduleItemWeektype.both)
  const [lessontype, setLessonType] = useState(ScheduleItemLectureType.lecture)
  const [discipline, setDiscipline] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [classroom, setClassroom] = useState("");
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([])
        
  useEffect(() => {
    async function fetchTeachers() {
      try {
        const data = await apiFetchClient<Teacher[]>("/v1/teachers");
        setTeachers(data.response || []);
      } catch (error) {
        console.error("Error fetching teacher:", error);
      }
    }
    fetchTeachers();
  }, []);

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
      const response = await fetch(`${getPublicApiBaseUrl()}/v1/schedules/${scheduleId}/items`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([
          {
            weekday: weekday,
            lesson_number: lessonNumber,
            weektype: Number(weektype),
            discipline: discipline,
            teacher_id: teacherId,
            lesson_type: Number(lessontype),
            students_count: studentsCount,
            subgroup: subgroup,
            classroom: classroom,
          }
        ]),
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
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500"
          >
            {weekdays.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Номер пары
          </label>
          <input
            type="number"
            value={lessonNumber+1}
            onChange={(e) => setLessonNumber(Number(e.target.value)-1)}
            required
            min="1"
            max="8"
            className="w-full border border-gray-300 text-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Тип недели
          </label>
          <select
            value={weektype}
            onChange={(e) => setWeektype(Number(e.target.value))}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500"
          >
            <option value="">Выберите тип недели</option>
            {(Object.keys(scheduleItemWeektypeLabels) as unknown as ScheduleItemWeektype[]).map(
              (key) => (
                <option key={key} value={key}>
                  {scheduleItemWeektypeLabels[key]}
                </option>
              )
            )}
          </select>
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
            className="w-full border border-gray-300 text-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Введите название предмета"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID преподавателя
          </label>
          <select
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500"
          >
            <option value="">Выберите преподавателя</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name} ({teacher.id})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Тип занятия
          </label>
          <select
            value={lessontype}
            onChange={(e) => setLessonType(Number(e.target.value))}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500"
          >
            <option value="">Выберите тип занятия</option>
            {(Object.keys(scheduleItemLectureTypeLabels) as unknown as ScheduleItemLectureType[]).map(
              (key) => (
                <option key={key} value={key}>
                  {scheduleItemLectureTypeLabels[key]}
                </option>
              )
            )}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Число студентов
          </label>
          <input
            type="number"
            value={studentsCount}
            onChange={(e) => setStudentsCount(Number(e.target.value))}
            required
            min="0"
            className="w-full border border-gray-300 text-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Подгруппа (значение 0 указывает, что занятие для всех подгрупп)
          </label>
          <input
            type="number"
            value={subgroup}
            onChange={(e) => setSubgroup(Number(e.target.value))}
            required
            min="0"
            className="w-full border border-gray-300 text-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Аудитория
          </label>
          <input
            type="text"
            value={classroom}
            onChange={(e) => setClassroom(e.target.value)}
            required
            className="w-full border border-gray-300 text-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Укажите аудиторию"
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

