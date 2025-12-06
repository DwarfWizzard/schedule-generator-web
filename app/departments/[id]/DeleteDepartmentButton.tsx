"use client";

import { useRouter } from "next/navigation";
import { getApiUrl, handleApiResponse, formatApiError } from "../../utils/api";

export default function DeleteDepartmentButton({ departmentId }: { departmentId: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Вы уверены, что хотите удалить эту кафедру? Это действие нельзя отменить.")) {
      return;
    }

    try {
      const response = await fetch(`${getApiUrl()}/v1/departments/${departmentId}`, {
        method: "DELETE",
      });

      await handleApiResponse(response);

      router.push("/departments");
      router.refresh();
    } catch (error) {
      alert("Ошибка: " + formatApiError(error));
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
    >
      Удалить кафедру
    </button>
  );
}

