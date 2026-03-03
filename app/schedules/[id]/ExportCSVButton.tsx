"use client";

import { getAccessToken, getPublicApiBaseUrl } from "@/app/lib/apiFetch";
import { JwtPayload } from "@/app/lib/jwt";
import { UserRole } from "@/app/users/types";
import { log } from "console";
import router from "next/router";
import { useEffect, useState } from "react";

export default function ExportCSVButton({ scheduleId }: { scheduleId: string }) {
  const [loading, setLoading] = useState(false);
  const [calendarFormat, setCalendarFormat] = useState(true);
  const [userRole, setUserRole] = useState<number | null>(null);

  // useEffect(() => {
  //     const accessToken = localStorage.getItem('access_token');
  //     if (!accessToken) {
  //       router.push('/login');
  //       return;
  //     }
  
  //     const payloadStr = localStorage.getItem('user_payload');
  //     if (payloadStr) {
  //       try {
  //         const payload = JSON.parse(payloadStr) as JwtPayload;
  //         setUserRole(payload.user_role);
  //       } catch (e) {
  //         console.error('Failed to parse user_payload', e);
  //         setUserRole(null);
  //       }
  //     } else {
  //       setUserRole(null);
  //     }
  
  //     setLoading(false);
  //   }, [router]);

  async function handleExport() {
    setLoading(true);
    try {
      const asCalendar = calendarFormat
      const response = await fetch(`${getPublicApiBaseUrl()}/v1/schedules/${scheduleId}/export?format=csv&as_calendar=${asCalendar}`,
        {
          headers: {
            Authorization: `Bearer ${getAccessToken() || ''}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("Ошибка при выгрузке CSV");
      }

      const contentDisposition = response.headers.get('Content-Disposition') || '';
      console.log(contentDisposition)
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      console.log(filenameMatch)
      const filename = filenameMatch?.toString() ||`schedule-${scheduleId}.csv`;
      console.log(filename)

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
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
          disabled={true} // TODO: use userRole != UserRole.admin
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

