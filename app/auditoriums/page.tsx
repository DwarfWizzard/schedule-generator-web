"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiFetchClient } from "../lib/apiFetch";
import {
  WorkloadApiResponse,
  WorkloadData,
  WorkloadLesson,
  MonthDay,
  WEEKDAYS,
  WEEKDAY_SHORT,
  MONTH_NAMES,
  LESSON_TYPE_LABELS,
  WEEKTYPE_LABELS,
  generateMonthDays,
  allGroupsOnPractice,
  normalizeWorkload,
  Weekday,
} from "./types";

type SlotKind = "free" | "busy" | "practice";

interface Slot {
  pairNum: number;
  kind: SlotKind;
  lesson?: WorkloadLesson;
}

export default function AuditoriumWorkloadPage() {
  const [data, setData] = useState<WorkloadData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [building, setBuilding] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [modal, setModal] = useState<
    | null
    | {
        lesson: WorkloadLesson;
        room: string;
        pairNum: number;
        day: MonthDay;
      }
  >(null);

  // Загрузка
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
        const ayStart = new Date(norm.academicYearStart);
        const now = new Date();
        if (now < ayStart) {
          setMonth(ayStart.getMonth() + 1);
          setYear(ayStart.getFullYear());
        }
        setError(null);
      })
      .catch((e) => !cancelled && setError(String(e?.message ?? e)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const corpora = useMemo(
    () => (data ? Object.keys(data.buildings) : []),
    [data],
  );

  const days: MonthDay[] = useMemo(() => {
    if (!data) return [];
    return generateMonthDays(year, month, data.academicYearStart);
  }, [data, year, month]);

  const rooms = useMemo(() => {
    if (!data) return [];
    const corpus = data.buildings[building];
    if (!corpus) return [];
    return Object.keys(corpus).sort((a, b) => parseInt(a) - parseInt(b));
  }, [data, building]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const pairNums = data
    ? Array.from({ length: data.maxPairsPerDay }, (_, i) => i + 1)
    : [];

  function buildSlots(room: string, day: MonthDay): Slot[] {
    if (!data) return [];
    const corpus = data.buildings[building];
    const lessons = corpus?.[room]?.[day.dayOfWeek] ?? [];

    const byNum = new Map<number, WorkloadLesson>();
    for (const l of lessons) {
      if (l.weektype !== "both" && l.weektype !== day.weekParity) continue;
      byNum.set(l.lesson_number, l);
    }

    return pairNums.map((n) => {
      const lesson = byNum.get(n);
      if (!lesson) return { pairNum: n, kind: "free" };
      const practice = allGroupsOnPractice(lesson, day.date);
      return { pairNum: n, kind: practice ? "practice" : "busy", lesson };
    });
  }

  // Стили
  const pageBg = "min-h-screen bg-[#0D1117] text-[#E6EDF3]";
  const selectCls =
    "font-mono text-[13px] bg-[#21262D] text-[#E6EDF3] border border-[#30363D] rounded-lg px-2.5 py-1.5 outline-none focus:border-[#6366F1] cursor-pointer";

  return (
    <div className={pageBg}>
      {/* Header */}
      <header className="sticky top-0 z-30 h-[72px] px-6 flex items-center gap-8 border-b border-[#30363D] bg-[#0D1117]/85 backdrop-blur">
        <div className="flex items-center gap-2 font-mono text-[15px] font-semibold whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-[#6366F1] shadow-[0_0_10px_#6366F1]" />
          Загруженность аудиторий
        </div>

        {/* Переключатель страниц */}
        <nav className="flex items-center gap-1 rounded-lg border border-[#30363D] bg-[#161B22] p-1">
          <Link
            href="/auditoriums"
            className="px-3 py-1.5 rounded-md text-[12px] font-mono font-semibold bg-[#6366F1] text-white"
          >
            Месяц
          </Link>
          <Link
            href="/auditoriums/weekly"
            className="px-3 py-1.5 rounded-md text-[12px] font-mono font-semibold text-[#7D8590] hover:text-[#E6EDF3]"
          >
            Неделя
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#7D8590]">
              Корпус
            </span>
            <select
              className={selectCls}
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
            >
              {corpora.map((c) => (
                <option key={c} value={c}>
                  Корпус {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#7D8590]">
              Месяц
            </span>
            <select
              className={selectCls}
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
            >
              {MONTH_NAMES.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#7D8590]">
              Год
            </span>
            <select
              className={selectCls}
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
            >
              {[year - 1, year, year + 1].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="p-6 flex flex-col gap-4">
        <div className="text-[13px] text-[#7D8590]">
          {loading && "Загрузка..."}
          {error && <span className="text-[#F43F5E]">Ошибка: {error}</span>}
          {!loading && !error && data && (
            <>
              Корпус <span className="text-[#E6EDF3] font-semibold">«{building}»</span> ·{" "}
              <span className="text-[#E6EDF3] font-semibold">
                {MONTH_NAMES[month - 1]} {year}
              </span>{" "}
              · <span className="text-[#E6EDF3] font-semibold">{rooms.length}</span>{" "}
              аудиторий
            </>
          )}
        </div>

        {!loading && !error && data && (
          <div className="overflow-x-auto rounded-xl border border-[#30363D]">
            <table
              className="border-separate border-spacing-0"
              style={{ width: "max-content", minWidth: "100%" }}
            >
              <thead>
                <tr>
                  <th className="sticky left-0 z-20 w-[100px] min-w-[100px] bg-[#161B22] border-b border-[#30363D] text-[10px] uppercase tracking-widest text-[#7D8590] py-3">
                    Ауд.
                  </th>
                  {days.map((d) => {
                    const isWeekend = d.dayOfWeek === "saturday";
                    const isToday = d.date === todayStr;
                    return (
                      <th
                        key={d.date}
                        className={`min-w-[130px] border-b border-l border-[#30363D] py-3 text-center ${
                          isWeekend ? "bg-[#F59E0B08]" : "bg-[#161B22]"
                        } ${isToday ? "bg-[#6366F10D]" : ""}`}
                      >
                        <span
                          className={`block font-mono text-[20px] font-semibold leading-none ${
                            isWeekend
                              ? "text-[#F59E0B]"
                              : isToday
                                ? "text-[#6366F1]"
                                : "text-[#E6EDF3]"
                          }`}
                        >
                          {d.dayNumber}
                        </span>
                        <span className="block mt-1 text-[11px] uppercase tracking-wider text-[#7D8590]">
                          {WEEKDAY_SHORT[d.dayOfWeek]}
                        </span>
                        <span
                          className={`inline-flex items-center justify-center mt-1.5 w-[22px] h-4 rounded text-[10px] font-mono font-semibold ${
                            d.weekParity === "even"
                              ? "bg-[#6366F118] text-[#6366F1] border border-[#6366F130]"
                              : "bg-[#F59E0B18] text-[#F59E0B] border border-[#F59E0B30]"
                          }`}
                        >
                          {d.weekParity === "even" ? "Ч" : "Н"}
                        </span>
                      </th>
                    );
                  })}
                </tr>
                <tr>
                  <th className="sticky left-0 z-20 bg-[#161B22] border-b border-[#30363D]" />
                  {days.map((d) => {
                    const isWeekend = d.dayOfWeek === "saturday";
                    return (
                      <th
                        key={d.date}
                        className={`border-b border-l border-[#30363D] py-2 ${
                          isWeekend ? "bg-[#F59E0B08]" : "bg-[#161B22]"
                        }`}
                      >
                        <div className="flex justify-center">
                          {pairNums.map((n) => (
                            <span
                              key={n}
                              className="w-4 text-center font-mono text-[10px] text-[#7D8590]"
                            >
                              {n}
                            </span>
                          ))}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room}>
                    <td className="sticky left-0 z-10 bg-[#161B22] border-b border-r border-[#30363D] px-3 h-12">
                      <span className="font-mono text-[14px] font-semibold">
                        {room}
                      </span>
                    </td>
                    {days.map((day) => {
                      const isWeekend = day.dayOfWeek === "saturday";
                      const slots = buildSlots(room, day);
                      return (
                        <td
                          key={day.date}
                          className={`border-b border-l border-[#30363D] ${
                            isWeekend ? "bg-[#F59E0B06]" : "bg-[#161B22]"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-px h-12 px-1.5">
                            {slots.map((s) => (
                              <button
                                key={s.pairNum}
                                type="button"
                                disabled={s.kind === "free"}
                                onClick={() =>
                                  s.lesson &&
                                  setModal({
                                    lesson: s.lesson,
                                    room,
                                    pairNum: s.pairNum,
                                    day,
                                  })
                                }
                                className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] transition ${
                                  s.kind === "busy"
                                    ? "bg-[#F43F5E15] border border-[#F43F5E30] hover:scale-125 hover:shadow-[0_0_10px_#F43F5E] cursor-pointer"
                                    : s.kind === "practice"
                                      ? "bg-[#10B98115] border border-[#10B98130] text-[#10B981] cursor-default"
                                      : "bg-[#10B98115] border border-[#10B98130] cursor-default"
                                }`}
                                aria-label={`Пара ${s.pairNum}`}
                              >
                                <span
                                  className={`block w-1.5 h-1.5 rounded-full ${
                                    s.kind === "busy" ? "bg-[#F43F5E]" : "bg-[#10B981]"
                                  }`}
                                />
                                {s.kind === "practice" && (
                                  <span className="absolute -mt-3 -ml-3 text-[8px] font-bold">
                                    П
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-5 flex-wrap pt-4">
          <div className="flex items-center gap-2 text-[12px] text-[#7D8590]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" /> Свободно
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#7D8590]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#F43F5E]" /> Занято
            (нажмите для деталей)
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#7D8590]">
            <span className="inline-flex items-center justify-center w-[22px] h-4 rounded text-[10px] font-mono font-semibold bg-[#6366F118] text-[#6366F1] border border-[#6366F130]">
              Ч
            </span>
            Чётная неделя
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#7D8590]">
            <span className="inline-flex items-center justify-center w-[22px] h-4 rounded text-[10px] font-mono font-semibold bg-[#F59E0B18] text-[#F59E0B] border border-[#F59E0B30]">
              Н
            </span>
            Нечётная неделя
          </div>
        </div>
      </main>

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-5"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-[#0D1117]/60 backdrop-blur-md"
            onClick={() => setModal(null)}
          />
          <div className="relative z-10 w-full max-w-[420px] rounded-2xl border border-[#6366F14D] bg-[#161B22]/90 p-7 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <button
              className="absolute top-3.5 right-3.5 w-7 h-7 rounded-lg border border-[#30363D] bg-[#21262D] text-[#7D8590] hover:text-[#E6EDF3]"
              onClick={() => setModal(null)}
              aria-label="Закрыть"
            >
              ✕
            </button>

            <span className="inline-flex items-center px-2 py-0.5 mb-3.5 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-[#6366F118] text-[#6366F1] border border-[#6366F130]">
              {LESSON_TYPE_LABELS[modal.lesson.lesson_type]}
            </span>

            <div className="text-[18px] font-bold mb-4">
              {modal.lesson.discipline}
            </div>

            <dl className="flex flex-col gap-2.5 text-[13px]">
              <Row k="Преподаватель" v={modal.lesson.teacher_name} />
              <Row k="Группы" v={modal.lesson.edu_group.join(", ")} />
              <Row
                k="Аудитория"
                v={`Корпус ${building} · ауд. ${modal.room}`}
              />
              <Row
                k="Дата"
                v={`${modal.day.date} (${WEEKDAY_SHORT[modal.day.dayOfWeek]})`}
              />
              <Row
                k="Пара"
                v={`${modal.pairNum}-я пара · ${
                  modal.day.weekParity === "even" ? "Чётная" : "Нечётная"
                } неделя`}
              />
              <Row k="Студентов" v={`${modal.lesson.students_count} чел.`} />
              {modal.lesson.subgroup > 0 && (
                <Row k="Подгруппа" v={String(modal.lesson.subgroup)} />
              )}
            </dl>

            <hr className="my-4 border-[#30363D]" />
            <div className="font-mono text-[11px] text-[#7D8590] flex items-center gap-2">
              <span className="text-[#6366F1]">●</span>
              Тип недели:{" "}
              {modal.lesson.weektype === "both"
                ? "каждую неделю"
                : WEEKTYPE_LABELS[modal.lesson.weektype]}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start gap-3">
      <dt className="w-[110px] shrink-0 text-[12px] text-[#7D8590]">{k}</dt>
      <dd className="font-mono text-[12px] text-[#E6EDF3]">{v}</dd>
    </div>
  );
}