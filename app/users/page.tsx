"use client";

import Link from "next/link";
import { apiFetchClient } from "../lib/apiFetch";
import { User, userRolesLabels } from "./types";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
          
    useEffect(() => {
      async function fetchUsers() {
        try {
          const data = await apiFetchClient<User[]>("/v1/users");
          setUsers(data.response || []);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
      fetchUsers();
    }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-500">Пользователи</h1>
        <Link
          href="/users/new"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
        >
          Добавить пользователя
        </Link>
      </div>

      {users.length === 0 ? (
        <p className="text-gray-500">Пользователи не найдены</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Имя
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Никнейм
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Роль
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Факультет
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.id || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.name || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.username || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {userRolesLabels[user.role] || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" title={user.faculty_id || ""}>
                    {user.faculty_name || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/users/${user.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Открыть
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

