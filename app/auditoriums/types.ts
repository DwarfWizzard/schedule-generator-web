// Типы ответа GET /v1/cabinets/workload

export type Weektype = "odd" | "even" | "both";

export type LessonType = "lecture" | "practice" | "seminar" | "exam" | "laboratory";

export interface Practice {
  group: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
}

export interface WorkloadLesson {
  lesson_number: number;
  weektype: Weektype;
  discipline: string;
  teacher_name: string;
  edu_group: string[];
  students_count: number;
  lesson_type: LessonType;
  subgroup: number;
  practices?: Practice[];
}

// День недели → список занятий
export type DaySchedule = Partial<Record<Weekday, WorkloadLesson[]>>;

// Номер аудитории → расписание по дням недели
export type RoomSchedule = Record<string, DaySchedule>;

// Корпус → аудитории
export type BuildingMap = Record<string, RoomSchedule>;

// Обёртка ответа бэкенда
export interface WorkloadApiResponse {
  status: number;
  response: {
    academic_year_start: string;
    max_pairs_per_day: string | number;
    cabinet_workload_final_output: BuildingMap;
  };
}

// Нормализованный вид для UI
export interface WorkloadData {
  academicYearStart: string;
  maxPairsPerDay: number;
  buildings: BuildingMap;
}

// ── Дни недели ──
export const ALL_DAYS = [
  "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday",
] as const;

export type Weekday = typeof ALL_DAYS[number];
// Рабочие дни (без воскресенья) — для отрисовки
export type WorkDay = Exclude<Weekday, "sunday">;

// ── Константы ──
export const WEEKDAYS: WorkDay[] = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday",
];

// export type Weekday = typeof WEEKDAYS[number];

export const WEEKDAY_SHORT: Record<Weekday, string> = {
  monday: "Пн", tuesday: "Вт", wednesday: "Ср",
  thursday: "Чт", friday: "Пт", saturday: "Сб", sunday: "Вс",
};

export const MONTH_NAMES = [
  "Январь","Февраль","Март","Апрель","Май","Июнь",
  "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь",
];

export const LESSON_TYPE_LABELS: Record<LessonType, string> = {
  lecture: "лекция",
  practice: "практика",
  seminar: "семинар",
  exam: "экзамен",
  laboratory: "лаборатория",
};

export const WEEKTYPE_LABELS: Record<Weektype, string> = {
  odd: "нечётная",
  even: "чётная",
  both: "все",
};

// ── Утилиты ──

/** Чётность недели для даты относительно начала учебного года. */
export function getWeekParity(dateStr: string, yearStart: string): "even" | "odd" {
  const d0 = new Date(yearStart);
  const d1 = new Date(dateStr);
  d0.setHours(0, 0, 0, 0);
  d1.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((d1.getTime() - d0.getTime()) / 86_400_000);
  const weekNum = Math.floor(diffDays / 7);
  const absWeek = ((weekNum % 2) + 2) % 2;
  return absWeek === 0 ? "even" : "odd";
}

export interface MonthDay {
  date: string;
  dayOfWeek: WorkDay;
  weekParity: "even" | "odd";
  dayNumber: number;
}

/** Календарные дни месяца (кроме воскресенья). */
export function generateMonthDays(
  year: number,
  month: number,
  academicStart: string,
): MonthDay[] {
  const out: MonthDay[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const jsDate = new Date(dateStr);
    const dayOfWeek = ALL_DAYS[jsDate.getDay()];
    if (dayOfWeek === "sunday") continue;
    out.push({
      date: dateStr,
      dayOfWeek,                       // сузится до WorkDay
      weekParity: getWeekParity(dateStr, academicStart),
      dayNumber: d,
    });
  }
  return out;
}

/** Все ли группы занятия сейчас на практике? */
export function allGroupsOnPractice(lesson: WorkloadLesson, dateStr: string): boolean {
  const practices = lesson.practices;
  if (!practices || practices.length === 0) return false;
  const groups = Array.isArray(lesson.edu_group) ? lesson.edu_group : [lesson.edu_group];
  return groups.every((g) =>
    practices.some((p) => p.group === g && p.start_date <= dateStr && dateStr <= p.end_date),
  );
}

/** Загруженность занятия соответствует выбранной чётности. */
export function lessonMatchesParity(
  weektype: Weektype,
  parity: "odd" | "even" | "both",
): boolean {
  if (parity === "both") return true;
  return weektype === parity || weektype === "both";
}

/** Нормализация ответа API. */
export function normalizeWorkload(raw: WorkloadApiResponse): WorkloadData {
  return {
    academicYearStart: raw.response.academic_year_start,
    maxPairsPerDay: Number(raw.response.max_pairs_per_day),
    buildings: raw.response.cabinet_workload_final_output,
  };
}