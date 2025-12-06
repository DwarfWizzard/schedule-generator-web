"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getApiUrl, handleApiResponse, formatApiError } from "../../../utils/api";
import { EduDirection } from "../../types";

export default function EditEduDirection() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchEduDirection() {
      try {
        const response = await fetch(`${getApiUrl()}/v1/edu-directions/${id}`);
        const data = await handleApiResponse<EduDirection>(response);
        
        if (data.response) {
          setName(data.response.name || "");
        }
      } catch (error) {
        alert("Ошибка загрузки данных: " + formatApiError(error));
        router.push("/edu-directions");
      } finally {
        setFetching(false);
      }
    }

    fetchEduDirection();
  }, [id, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const body: any = {};
      
      if (name) {
        body.name = name;
      }

      const response = await fetch(`${getApiUrl()}/v1/edu-directions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      await handleApiResponse(response);

      router.push(`/edu-directions/${id}`);
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
          href={`/edu-directions/${id}`}
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Назад к направлению
        </Link>
        <h1 className="text-3xl font-bold text-gray-500">Редактировать направление подготовки</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Название направления
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500 placeholder-gray-500"
            placeholder="Введите название направления"
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

