"use client";

import { getApiUrl, handleApiResponse, formatApiError } from "../../utils/api";

export default function DeleteItemButton({ scheduleId, itemId }: { scheduleId: string; itemId: string }) {
  async function handleDelete() {
    if (!confirm("Вы уверены, что хотите удалить это занятие?")) {
      return;
    }

    try {
      const response = await fetch(`${getApiUrl()}/v1/schedules/${scheduleId}/items/${itemId}`, {
        method: "DELETE",
      });

      await handleApiResponse(response);

      window.location.reload();
    } catch (error) {
      alert("Ошибка: " + formatApiError(error));
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-900 underline"
    >
      Удалить
    </button>
  );
}

