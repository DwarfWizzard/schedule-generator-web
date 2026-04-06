"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import AddPracticePage from "./AddPracticePage";

export default function AddSchedulePractice() {
  const router = useRouter();
  const params = useParams();
  const scheduleId = params.id as string;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link
          href={`/schedules/${scheduleId}`}
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Назад к расписанию
        </Link>

        <h1 className="text-3xl font-bold text-gray-500">
          Добавить практику
        </h1>
      </div>

      <AddPracticePage scheduleId={scheduleId} />
    </div>
  );
}