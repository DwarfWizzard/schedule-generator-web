"use client";

import { Trash2 } from "lucide-react";
import { getApiUrl, handleApiResponse, formatApiError } from "../../utils/api";
import { ScheduleItem, weekdayLables } from "../types";

export default function DeleteItemButton({ scheduleId, item }: { scheduleId: string, item: ScheduleItem }) {
  async function handleDelete() {
    if (!confirm("Вы уверены, что хотите удалить это занятие?")) {
      return;
    }

    const payload = [
      {
        weekday: weekdayLables.findIndex(x => item.weekday === x),
        lesson_number: item.lesson_number,
        subgroup: item.subgroup,
        weektype: item.weektype
      }
    ]

    try {
      const response = await fetch(`${getApiUrl()}/v1/schedules/${scheduleId}/items`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
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
      className="
          absolute top-1 right-1 
          hidden group-hover:flex
          items-center justify-center
          p-0.5 rounded-md bg-white shadow
          hover:bg-red-100 transition
      "
      >
      <Trash2 className="w-3 h-3 text-red-500" />
    </button>
  );
}

