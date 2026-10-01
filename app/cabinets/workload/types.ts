// Одна пара из ответа GET /v1/cabinets/workload
export interface WorkloadLesson {
  lesson_number: number;   // номер пары: 1–7
  weektype: string;        // "odd" | "even" | "both"
  discipline: string;      // название дисциплины
  teacher_name: string;    // имя преподавателя
  edu_group: string;       // номер учебной группы
  students_count: number;  // кол-во студентов
  lesson_type: string;     // "lecture" | "practice" | "seminar" | "exam" | "laboratory"
  subgroup: number;        // 0 = вся группа, 1 / 2 = подгруппа
}

// Расписание одной аудитории по дням недели
// Ключ — "monday" | "tuesday" | ... | "saturday"
export type AuditoriumDaySchedule = Partial<Record<string, WorkloadLesson[]>>;

// Все аудитории одного корпуса
// Ключ — номер/название аудитории
export type BuildingSchedule = Record<string, AuditoriumDaySchedule>;

// Полный ответ бэка
// Ключ — название корпуса
export type WorkloadResponse = Record<string, BuildingSchedule>;

// ─── Вспомогательные словари ────────────────────────────────────────────────

// Дни недели: ключ из API → русское название
export const weekdayLabels: Record<string, string> = {
  monday:    "Пн",
  tuesday:   "Вт",
  wednesday: "Ср",
  thursday:  "Чт",
  friday:    "Пт",
  saturday:  "Сб",
};

// Порядок дней для сортировки столбцов
export const weekdayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

// Тип недели → русская метка и цвет бейджа
export const weektypeConfig: Record<string, { label: string; className: string }> = {
  odd:  { label: "нечётная", className: "bg-blue-100 text-blue-700" },
  even: { label: "чётная",   className: "bg-green-100 text-green-700" },
  both: { label: "все",      className: "bg-gray-100 text-gray-600" },
};

// Тип пары → русская метка и цвет
export const lessonTypeConfig: Record<string, { label: string; className: string }> = {
  lecture:    { label: "лекция",       className: "text-purple-600" },
  practice:   { label: "практика",     className: "text-blue-600" },
  seminar:    { label: "семинар",      className: "text-teal-600" },
  exam:       { label: "экзамен",      className: "text-red-600" },
  laboratory: { label: "лаборатория",  className: "text-orange-600" },
};
