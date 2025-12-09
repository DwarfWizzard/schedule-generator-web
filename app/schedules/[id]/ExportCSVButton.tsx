"use client";

import { useState } from "react";
import { getApiUrl } from "../../utils/api";

export default function ExportCSVButton({ scheduleId }: { scheduleId: string }) {
  const [loading, setLoading] = useState(false);
  const [calendarFormat, setCalendarFormat] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const asCalendar = calendarFormat
      const response = await fetch(`${getApiUrl()}/v1/schedules/${scheduleId}/export?format=csv&as_calendar=${asCalendar}`);
      
      if (!response.ok) {
        throw new Error("Ошибка при выгрузке CSV");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `schedule-${scheduleId}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert("Ошибка: " + (error instanceof Error ? error.message : "Неизвестная ошибка"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={calendarFormat}
          onChange={(e) => setCalendarFormat(e.target.checked)}
          className="mr-2"
        />
        <p className="text-gray-500">Календарный формат</p>
        </label>
      <button
        onClick={handleExport}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
      >
        {loading ? "Выгрузка..." : "Выгрузить в CSV"}
      </button>
    </div>
  );
}

