"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetchClient, formatApiError, } from "@/app/lib/apiFetch";
import { UserRole, userRolesLabels } from "../types";
import { Faculty } from "@/app/faculties/types";

export default function NewUser() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [facultyId, setFacultytId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState(UserRole.deputy_dean);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [faculties, setFaculties] = useState<Faculty[]>([])
  
  useEffect(() => {
    async function fetchFaculties() {
      try {
        const data = await apiFetchClient<Faculty[]>("/v1/faculties");
        setFaculties(data.response || []);
      } catch (error) {
        console.error("Error fetching faculties:", error);
      }
    }
    fetchFaculties();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiFetchClient(`/v1/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          username: username,
          role: Number(role),
          faculty_id: facultyId,
          password: password,
        }),
      });

      router.push("/users");
      router.refresh();
    } catch (error) {
      alert("Ошибка: " + formatApiError(error));
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-500 mb-6">Новый преподаватель</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Имя пользователя <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-500 placeholder-gray-500"
            placeholder="Введите имя пользователя"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Роль
          </label>
          <select
            value={role}
            onChange={(e) => {setRole(Number(e.target.value))}}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-500 placeholder-gray-500"
          >
            <option value="">Выберите роль</option>
            {(Object.keys(userRolesLabels) as unknown as UserRole[]).map(
              (key) => (
                <option key={key} value={key}>
                  {userRolesLabels[key]}
                </option>
              )
            )}
          </select>
        </div>

        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID факультета (UUID) <span className="text-red-500">*</span>
          </label>
          <select
            value={facultyId ?? ""}
            onChange={(e) => setFacultytId(e.target.value || null)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500"
          >
            <option value="">Выберите кафедру</option>
            {faculties.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>
                {faculty.name} ({faculty.id})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Никнейм <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-500 placeholder-gray-500"
            placeholder="Введите никнейм для пользователя"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Пароль <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-500 placeholder-gray-500"
            placeholder="Введите пароль для пользователя (сохраните его отдельно, чтобы не потерять)"
          />
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

function handleApiResponse(response: Response) {
  throw new Error("Function not implemented.");
}

