"use client";

import { useRouter } from "next/navigation";
import { apiFetchClient, formatApiError, getPublicApiBaseUrl } from "@/app/lib/apiFetch";

export default function DeleteEduGroupButton({ eduGroupId }: { eduGroupId: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Вы уверены, что хотите удалить эту учебную группу? Это действие нельзя отменить.")) {
      return;
    }

    try {
      const response = await apiFetchClient(`/v1/edu-groups/${eduGroupId}`, {
        method: "DELETE",
      });

      router.push("/edu-groups");
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
      Удалить группу
    </button>
  );
}

