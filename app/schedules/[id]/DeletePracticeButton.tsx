"use client";

import { Trash2 } from "lucide-react";
import { ScheduleItem, SchedulePractice, weekdayLables } from "../types";
import { apiFetchClient, formatApiError } from "@/app/lib/apiFetch";

export default function DeletePracticeButton({ scheduleId, practice }: { scheduleId: string, practice: SchedulePractice }) {
  async function handleDelete() {
    if (!confirm("Вы уверены, что хотите удалить эту практику ?")) {
      return;
    }

    const payload = [
      {
        practice_type: practice.practice_type,
        start_date: practice.start_date,
        end_date: practice.end_date,
      }
    ]

    try {
      const response = await apiFetchClient(`/v1/schedules/${scheduleId}/practices`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

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
            opacity-0 group-hover:opacity-100
            pointer-events-none group-hover:pointer-events-auto
            transition-opacity duration-200
            flex items-center justify-center
            p-1 rounded-md bg-white shadow
            hover:bg-red-100
        "
        >
        <Trash2 className="w-3 h-3 text-red-500" />
    </button>
  );
}

