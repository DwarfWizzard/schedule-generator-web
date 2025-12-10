"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { handleApiResponse, formatApiError } from "../../../utils/api";
import { Department } from "../../types";
import { apiFetchClient, getPublicApiBaseUrl } from "@/app/apiFetch";

export default function EditDepartment() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [externalId, setExternalId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchDepartment() {
      try {
        const data = await apiFetchClient<Department>(`/v1/departments/${id}`);
        
        if (data.response) {
          setName(data.response.name || "");
          setExternalId(data.response.external_id || "");
        }
      } catch (error) {
        alert("Ошибка загрузки данных: " + formatApiError(error));
        router.push("/departments");
      } finally {
        setFetching(false);
      }
    }

    fetchDepartment();
  }, [id, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const body: {name?: string; external_id?: string} = {};
      
      if (name) {
        body.name = name;
      }
      
      if (externalId) {
        body.external_id = externalId;
      }

      const response = await fetch(`${getPublicApiBaseUrl()}/v1/departments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      await handleApiResponse(response);

      router.push(`/departments/${id}`);
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
          href={`/departments/${id}`}
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Назад к кафедре
        </Link>
        <h1 className="text-3xl font-bold text-gray-500">Редактировать кафедру</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Название кафедры
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500 placeholder-gray-500"
            placeholder="Введите название кафедры"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Внешний ID
          </label>
          <input
            type="text"
            value={externalId}
            onChange={(e) => setExternalId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500 placeholder-gray-500"
            placeholder="Введите внешний идентификатор"
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


