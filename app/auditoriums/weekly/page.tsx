"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiFetchClient } from "../../lib/apiFetch";
import { ReactElement } from "react";
import {
  WorkloadApiResponse,
  WorkloadData,
  WorkloadLesson,
  Weekday,
  WEEKDAYS,
  WEEKDAY_SHORT,
  LESSON_TYPE_LABELS,
  WEEKTYPE_LABELS,
  normalizeWorkload,
  lessonMatchesParity,
} from "../types";

type Parity = "odd" | "even" | "both";

export default function AuditoriumWeeklyPage() {
  const [data, setData] = useState<WorkloadData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [building, setBuilding] = useState("");
  const [day, setDay] = useState<Weekday | "">("");
  const [parity, setParity] = useState<Parity>("even");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiFetchClient<WorkloadApiResponse>("/v1/cabinets/workload")
      .then((res) => {
        if (cancelled) return;
        const norm = normalizeWorkload(res as unknown as WorkloadApiResponse);
        setData(norm);
        const corpora = Object.keys(norm.buildings);
        setBuilding(corpora[0] ?? "");
        setError(null);
      })
      .catch((e) => !cancelled && setError(String(e?.message ?? e)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const corpora = useMemo(() => (data ? Object.keys(data.buildings) : []), [data]);

  const filteredBuildings = useMemo(() => {
    if (!data) return [] as Array<[string, Record<string, any>]>;
    const entries = Object.entries(data.buildings) as Array<
      [string, Record<string, any>]
    >;
    const base = building
      ? entries.filter(([b]) => b === building)
      : entries;
    return base.sort(([a], [b]) => a.localeCompare(b));
  }, [data, building]);

  return (
    <div className="min-h-screen bg-[#0f1117] text-[#e2e8f8]">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center gap-3.5 px-7 py-3.5 border-b border-[#2a3050] bg-[#181c27]">
        <h1 className="font-mono text-[14px] font-semibold tracking-widest text-[#4f8ef7] uppercase">
          Загруженность аудиторий
        </h1>
        <span className="font-mono text-[11px] text-[#8892aa]">
          GET /v1/cabinets/workload
        </span>

        {/* Переключатель страниц */}
        <nav className="flex items-center gap-1 rounded-lg border border-[#2a3050] bg-[#0f1117] p-1 ml-4">
          <Link
            href="/auditoriums"
            className="px-3 py-1.5 rounded-md text-[12px] font-mono font-semibold text-[#8892aa] hover:text-[#e2e8f8]"
          >
            Месяц
          </Link>
          <Link
            href="/auditoriums/weekly"
            className="px-3 py-1.5 rounded-md text-[12px] font-mono font-semibold bg-[#4f8ef7] text-white"
          >
            Неделя
          </Link>
        </nav>
      </header>

      {/* Filters */}
      {data && (
        <div className="flex items-center gap-2.5 flex-wrap px-7 py-2.5 border-b border-[#2a3050] bg-[#181c27]">
          <label className="font-mono text-[12px] text-[#8892aa]">Корпус:</label>
          <select
            className="font-mono text-[12px] bg-[#0f1117] text-[#e2e8f8] border border-[#2a3050] rounded-md px-2.5 py-1.5 outline-none"
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
          >
            <option value="">Все</option>
            {corpora.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <label className="font-mono text-[12px] text-[#8892aa] ml-1.5">День:</label>
          <select
            className="font-mono text-[12px] bg-[#0f1117] text-[#e2e8f8] border border-[#2a3050] rounded-md px-2.5 py-1.5 outline-none"
            value={day}
            onChange={(e) => setDay(e.target.value as Weekday | "")}
          >
            <option value="">Все</option>
            {WEEKDAYS.map((d) => (
              <option key={d} value={d}>
                {WEEKDAY_SHORT[d]}
              </option>
            ))}
          </select>

          <div className="w-px h-5 bg-[#2a3050] mx-1" />

          <label className="font-mono text-[12px] text-[#8892aa]">Неделя:</label>
          <div className="flex items-center rounded-lg border border-[#2a3050] bg-[#1f2435] p-0.5">
            {(["odd", "both", "even"] as Parity[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setParity(p)}
                className={`px-3 py-1 rounded-md font-mono text-[12px] font-semibold transition ${
                  parity === p
                    ? p === "odd"
                      ? "bg-[#1e3a5f] text-[#93c5fd]"
                      : p === "even"
                        ? "bg-[#14432a] text-[#6ee7b7]"
                        : "bg-[#252a3a] text-[#94a3b8]"
                    : "text-[#8892aa]"
                }`}
              >
                {p === "odd" ? "нечёт" : p === "even" ? "чёт" : "все"}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-[#2a3050] mx-1" />

          <label className="font-mono text-[12px] text-[#8892aa]">Поиск:</label>
          <input
            type="text"
            placeholder="напр. 101"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="font-mono text-[12px] bg-[#0f1117] text-[#e2e8f8] border border-[#2a3050] rounded-md px-2.5 py-1.5 outline-none min-w-[150px]"
          />
        </div>
      )}

      <div className="px-7 py-2.5 font-mono text-[13px] text-[#8892aa] min-h-[36px]">
        {loading && <span className="text-[#4f8ef7]">Загрузка...</span>}
        {error && <span className="text-[#f87171]">Ошибка: {error}</span>}
        {!loading && !error && data && (
          <>Загружено корпусов: {Object.keys(data.buildings).length}</>
        )}
      </div>

      <main className="px-7 py-5">
        {!data || loading ? null : (
          <>
            {filteredBuildings.map(([bName, rooms]) => {
              const entries = Object.entries(rooms as Record<string, any>).filter(
                ([r]) => !search || r.toLowerCase().includes(search.toLowerCase()),
              );
              if (!entries.length) return null;
              return (
                <section key={bName} className="mb-10">
                  <div className="flex items-center gap-2.5 mb-3.5">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-[#8892aa]">
                      Корпус
                    </span>
                    <span className="font-mono text-[16px] font-semibold">
                      {bName}
                    </span>
                    <span className="font-mono text-[11px] text-[#8892aa] bg-[#1f2435] border border-[#2a3050] rounded-full px-2 py-0.5">
                      {entries.length} ауд.
                    </span>
                    <div className="flex-1 h-px bg-[#2a3050]" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {entries
                      .sort(([a], [b]) => a.localeCompare(b, "ru", { numeric: true }))
                      .map(([room, daySchedule]) => (
                        <RoomCard
                          key={room}
                          room={room}
                          daySchedule={daySchedule}
                          parity={parity}
                          dayFilter={day}
                        />
                      ))}
                  </div>
                </section>
              );
            })}
          </>
        )}
      </main>
    </div>
  );
}

function RoomCard({
  room,
  daySchedule,
  parity,
  dayFilter,
}: {
  room: string;
  daySchedule: Record<string, WorkloadLesson[]>;
  parity: Parity;
  dayFilter: Weekday | "";
}) {
  const total = WEEKDAYS.reduce((acc, d) => {
    const ls = daySchedule[d] ?? [];
    return acc + ls.filter((l) => lessonMatchesParity(l.weektype, parity)).length;
  }, 0);

  const activeDays = WEEKDAYS.filter((d) =>
    (daySchedule[d] ?? []).some((l) => lessonMatchesParity(l.weektype, parity)),
  );
  const firstActive = dayFilter || activeDays[0] || "monday";
  const [active, setActive] = useState<Weekday>(firstActive as Weekday);

  useEffect(() => {
    setActive(firstActive as Weekday);
  }, [firstActive]);

  return (
    <div className="rounded-[10px] border border-[#2a3050] bg-[#181c27] overflow-hidden">
      <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-[#2a3050] bg-[#1f2435]">
        <span className="font-mono text-[14px] font-semibold text-[#4f8ef7]">
          ауд. {room}
        </span>
        <span className="ml-auto font-mono text-[11px] text-[#8892aa]">
          {total} пар
        </span>
      </div>

      {!dayFilter && (
        <div className="flex border-b border-[#2a3050]">
          {WEEKDAYS.map((d) => {
            const ls = (daySchedule[d] ?? []).filter((l) =>
              lessonMatchesParity(l.weektype, parity),
            );
            const has = ls.length > 0;
            return (
              <button
                key={d}
                type="button"
                onClick={() => setActive(d)}
                className={`flex-1 py-1.5 text-center font-mono text-[11px] border-b-2 transition ${
                  active === d
                    ? "border-[#4f8ef7] text-[#4f8ef7]"
                    : has
                      ? "border-transparent text-[#8892aa] hover:text-[#e2e8f8]"
                      : "border-transparent text-[#8892aa] opacity-50"
                }`}
              >
                {WEEKDAY_SHORT[d]}
              </button>
            );
          })}
        </div>
      )}

      <div className="px-3.5 py-2 min-h-[60px]">
        <DayContent
          lessons={
            dayFilter
              ? (daySchedule[dayFilter] ?? []).filter((l) =>
                  lessonMatchesParity(l.weektype, parity),
                )
              : (daySchedule[active] ?? []).filter((l) =>
                  lessonMatchesParity(l.weektype, parity),
                )
          }
        />
      </div>
    </div>
  );
}

function DayContent({ lessons }: { lessons: WorkloadLesson[] }) {
  if (!lessons.length) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-[#1a4d2e] bg-[#0d2a1a] px-2.5 py-3 my-1.5">
        <span>🟢</span>
        <span className="font-mono text-[12px] text-[#4ade80]">
          весь день свободен
        </span>
      </div>
    );
  }

  const sorted = [...lessons].sort((a, b) => a.lesson_number - b.lesson_number);
  const maxLesson = sorted[sorted.length - 1].lesson_number;
  const byNum = new Map<number, WorkloadLesson[]>();
  sorted.forEach((l) => {
    if (!byNum.has(l.lesson_number)) byNum.set(l.lesson_number, []);
    byNum.get(l.lesson_number)!.push(l);
  });

  const today = new Date().toISOString().slice(0, 10);
//   const rows: JSX.Element[] = [];
    const rows: ReactElement[] = [];

  for (let n = 1; n <= maxLesson; n++) {
    const group = byNum.get(n);
    if (!group) {
      rows.push(
        <div
          key={`free-${n}`}
          className="grid grid-cols-[22px_1fr] gap-1.5 items-center my-0.5 px-1.5 py-1.5 rounded border border-[#1a4d2e] bg-[#0d2a1a]"
        >
          <span className="font-mono text-[11px] font-semibold text-[#22c55e]">
            {n}
          </span>
          <span className="font-mono text-[11px] text-[#4ade80] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_4px_#22c55e]" />
            свободно
          </span>
        </div>,
      );
      continue;
    }

    group.forEach((l, idx) => {
      // TODO: если у lesson появятся practices с group — заменить на allGroupsOnPractice
      const isPractice =
        Array.isArray(l.edu_group) &&
        (l as any).practices?.some?.((p: any) =>
          p.start_date <= today && today <= p.end_date,
        );

      if (isPractice) {
        rows.push(
          <div
            key={`prac-${n}-${idx}`}
            className="grid grid-cols-[22px_1fr] gap-1.5 items-center my-0.5 px-1.5 py-1.5 rounded border border-[#1a4d2e] bg-[#0d2a1a]"
          >
            <span className="font-mono text-[11px] font-semibold text-[#22c55e]">
              {idx === 0 ? n : ""}
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[11px] text-[#4ade80] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_4px_#22c55e]" />
                Группа на практике
              </span>
              <span className="font-mono text-[10px] text-[#4ade80]/75">
                {l.edu_group.join(", ")}
              </span>
            </div>
          </div>,
        );
        return;
      }

      rows.push(
        <div
          key={`les-${n}-${idx}`}
          className="grid grid-cols-[22px_1fr] gap-1.5 items-start py-1.5 border-b border-[#2a3050] last:border-b-0"
        >
          <span className="font-mono text-[11px] text-[#8892aa] pt-0.5">
            {idx === 0 ? n : ""}
          </span>
          <div>
            <div className="text-[12px] font-medium mb-0.5">
              {l.discipline}
            </div>
            <div className="flex flex-wrap gap-1 mb-0.5 items-center">
              <span className="font-mono text-[10px] px-1.5 py-px rounded bg-[#2d1f5e] text-[#a78bfa]">
                {LESSON_TYPE_LABELS[l.lesson_type]}
              </span>
              <span className="font-mono text-[10px] px-1.5 py-px rounded bg-[#252a3a] text-[#94a3b8]">
                {WEEKTYPE_LABELS[l.weektype]}
              </span>
              {l.subgroup > 0 && (
                <span className="font-mono text-[10px] px-1.5 py-px rounded bg-[#252a3a] text-[#94a3b8]">
                  п/г {l.subgroup}
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#8892aa]">
              {l.teacher_name} ·{" "}
              <span className="font-mono">
                {Array.isArray(l.edu_group) ? l.edu_group.join(", ") : l.edu_group}
              </span>{" "}
              · {l.students_count} чел.
            </div>
          </div>
        </div>,
      );
    });
  }

  return <>{rows}</>;
}