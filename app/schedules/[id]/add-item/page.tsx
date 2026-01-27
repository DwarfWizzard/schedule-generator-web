"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { handleApiResponse, formatApiError } from "../../../utils/api";
import { ScheduleItemLectureType, scheduleItemLectureTypeLabels, ScheduleItemWeektype, scheduleItemWeektypeLabels } from "../../types";
import { apiFetchClient, getPublicApiBaseUrl } from "@/app/apiFetch";
import { Teacher } from "@/app/teachers/types";
import AddOrEditItemPage from "./AddOrEditPage";

export default function AddScheduleItem() {
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
        <h1 className="text-3xl font-bold text-gray-500">Добавить занятие</h1>
      </div>

      <AddOrEditItemPage
        scheduleId={scheduleId}
      />
    </div>
  );
}

