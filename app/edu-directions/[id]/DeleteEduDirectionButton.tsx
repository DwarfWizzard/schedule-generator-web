"use client";

import { useRouter } from "next/navigation";
import { getApiUrl, handleApiResponse, formatApiError } from "../../utils/api";

export default function DeleteEduDirectionButton({ eduDirectionId }: { eduDirectionId: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Вы уверены, что хотите удалить это направление подготовки? Это действие нельзя отменить.")) {
      return;
    }

    try {
      const response = await fetch(`${getApiUrl()}/v1/edu-directions/${eduDirectionId}`, {
        method: "DELETE",
      });

      await handleApiResponse(response);

      router.push("/edu-directions");
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
      Удалить направление
    </button>
  );
}

