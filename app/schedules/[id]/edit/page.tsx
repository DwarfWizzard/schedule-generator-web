"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Schedule } from "../../types";
import { apiFetchClient, formatApiError, getPublicApiBaseUrl } from "@/app/lib/apiFetch";

export default function EditSchedule() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [semester, setSemester] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchSchedule() {
      try {
        const data = await apiFetchClient<Schedule>(`/v1/schedules/${id}`);
        
        if (data.response) {
          setSemester(data.response.semester || 0);
          if (data.response.start_date) {
            const date = new Date(data.response.start_date);
            setStartDate(date.toISOString().split('T')[0]);
        }
        if (data.response.end_date) {
            const date = new Date(data.response.end_date);
            setEndDate(date.toISOString().split('T')[0]);
        }
        }
      } catch (error) {
        alert("Ошибка загрузки данных: " + formatApiError(error));
        router.push("/schedules");
      } finally {
        setFetching(false);
      }
    }

    fetchSchedule();
  }, [id, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const body: {semester?: number; start_date?: string, end_date?: string} = {};
      
      if (semester) {
        body.semester = semester;
      }
      
      if (startDate) {
        body.start_date = startDate;
      }

      if (endDate) {
        body.end_date = endDate;
      }

      const response = await apiFetchClient(`/v1/schedules/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      router.push(`/schedules/${id}`);
      router.refresh();
    } catch (error) {
      alert("Ошибка: " + formatApiError(error));
      setLoading(false);
    }
  }

  if (fetching) {
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
          href={`/schedules/${id}`}
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Назад к расписанию
        </Link>
        <h1 className="text-3xl font-bold text-gray-500">Редактировать расписание</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Семестр
          </label>
          <input
            type="number"
            value={semester}
            onChange={(e) => setSemester(Number(e.target.value))}
            required
            min="1"
            max="12"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-500 placeholder-gray-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Дата начала расписания
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-500 placeholder-gray-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Дата окончания расписания
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-500 placeholder-gray-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
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


