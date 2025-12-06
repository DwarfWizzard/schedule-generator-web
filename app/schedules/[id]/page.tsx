import { apiFetch } from "../../apiFetch";
import Link from "next/link";
import ExportCSVButton from "./ExportCSVButton";

const weekdayLabels: Record<string, string> = {
  "Monday": "Понедельник",
  "Tuesday": "Вторник",
  "Wednesday": "Среда",
  "Thursday": "Четверг",
  "Friday": "Пятница",
  "Saturday": "Суббота",
};



const maxSubgroups = 2
const maxWeektypes = 2

export default async function SchedulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let schedule: Schedule | null = null;

  try {
    const data = await apiFetch(`/v1/schedules/${id}`);
    schedule = data.response;
    console.log(schedule)
  } catch (error) {
    console.error("Error fetching schedule:", error);
  }

  if (!schedule) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">Расписание не найдено</p>
        <Link href="/schedules" className="text-blue-600 hover:underline mt-4 inline-block">
          Вернуться к списку
        </Link>
      </div>
    );
  }

  let itemsPerWeekdayAndLessonNumber: Record<string, Record<number, ScheduleItem[]>> = {};
  if (schedule.type === ScheduleType.cycled && schedule.items) {
    schedule.items.forEach((item: ScheduleItem) => {
      const weekday = item.weekday
      if (!itemsPerWeekdayAndLessonNumber[weekday]) {
        itemsPerWeekdayAndLessonNumber[weekday] = {};
      }

      if (!itemsPerWeekdayAndLessonNumber[weekday][item.lesson_number]) {
        itemsPerWeekdayAndLessonNumber[weekday][item.lesson_number] = [];
      }

      itemsPerWeekdayAndLessonNumber[weekday][item.lesson_number].push(item)
    })
  }

  console.log(itemsPerWeekdayAndLessonNumber)

  const columns = ["Номер пары", ...Object.keys(weekdayLabels)];

  const table = Array.from({ length: 7 }, (_, index) => {
      const row: Record<string, ScheduleItem[][]> = {};

      columns.slice(1).forEach((weekday) => {
        if (!row[weekday]) {
          // заполняем тремя пустыми массивами
          row[weekday] = Array.from({ length: 3 }, () => [] as ScheduleItem[]);
        }

        const lessonNumber = index

        console.log(weekday, lessonNumber, itemsPerWeekdayAndLessonNumber[weekday]?.[lessonNumber])

        const items = itemsPerWeekdayAndLessonNumber[weekday]?.[lessonNumber]
        if (row[weekday] && items) {
          items.map((item) => {
            row[weekday][item.weektype ?? 0].push(item)
          })
        }
      });
      return row;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/schedules" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Назад к списку расписаний
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-500">Расписание {id}</h1>
          <div className="flex gap-2">
            <ExportCSVButton scheduleId={id} />
            <Link
              href={`/schedules/${id}/add-item`}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
            >
              Добавить занятие
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">ID</dt>
            <dd className="mt-1 text-sm text-gray-900">{schedule.id}</dd>
          </div>
          {schedule.type && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Тип</dt>
              <dd className="mt-1 text-sm text-gray-900">{scheduleTypeLabels[schedule.type]}</dd>
            </div>
          )}
          {schedule.start_date && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Начало</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(schedule.start_date).toLocaleDateString("ru-RU")}
              </dd>
            </div>
          )}
          {schedule.end_date && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Окончание</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(schedule.end_date).toLocaleDateString("ru-RU")}
              </dd>
            </div>
          )}
        </dl>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-gray-500">Список занятий</h2>

      {schedule.type === ScheduleType.calendar ? (
        <p className="text-gray-500">Календарные расписания временно не поддерживаются</p>
      ) : !schedule.items || schedule.items?.length === 0 ? (
        <p className="text-gray-500">Занятия не добавлены</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-max w-full border-collapse">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.map((row, rowIndex) => {
                const lessonNumber = rowIndex + 1;
                const itemsExistInRow = Object.values(row).some(
                  col => Object.values(col).some(
                    weektypeItems => Array.isArray(weektypeItems) && weektypeItems.length > 0
                  )
                );


                return (
                  <tr key={lessonNumber} className={itemsExistInRow ? "align-top" : "h-15"}>
                  {/* первая колонка: номер пары */}
                  <td className="px-0 py-0 text-center align-middle text-gray-500 border border-gray-300">
                    {lessonNumber}
                  </td>
                  
                  {columns.slice(1).map((col, i) => {
                      const items = row[col];

                      let printAddWeek = false

                      if (!items) {
                         if (typeof row[col] === 'string') {
                          return (
                            <td
                              key={col}
                              className="px-0 py-0 text-center align-middle text-gray-500 border border-gray-300"
                            >
                            </td>
                          );
                        }
                      }

                      return (
                        <td
                          key={col}
                          className="p-0 border border-gray-300 text-gray-500 align-top"
                        >
                          {items.map((itemList, i) => {
                            if (i == ScheduleItemWeektype.both) {
                              printAddWeek = false
                            }

                            if (itemList.length == 0) {
                              if (printAddWeek) {
                                return (
                                  <div
                                    key={`0-${i}`}
                                    className="w-full border text-xs grid place-items-center px-1 py-0.5 truncate h-10"
                                  >
                                    <p className="truncate">-</p>
                                  </div>
                                );
                              }
                              
                              return;
                            }

                            let fullSize = false

                            let subgroups = maxSubgroups

                            if (i == ScheduleItemWeektype.both || (itemList.length == 1 && itemList[0].subgroup == 0) ) {
                              fullSize = true
                              subgroups = new Set(itemList.filter(d => d.subgroup !== 0).map(d => d.subgroup)).size + 1
                            } else if (i != ScheduleItemWeektype.both) {
                              printAddWeek = true
                            }

                            console.log(subgroups, itemList)

                            if (fullSize) {
                              // один блок на всю строку
                              const item = itemList[0];

                              return (
                                <div
                                  key={`full-${i}`}
                                  className="w-full border text-xs grid place-items-center px-1 py-0.5 truncate h-15"
                                >
                                  <p className="truncate">{item?.discipline}</p>
                                  <p className="truncate text-gray-400 text-[12px]">ауд. {item?.classroom}</p>
                                </div>
                              );
                            }

                            // обычный режим: делим строку на подгруппы
                            return (
                              <div
                                key={i}
                                className="flex h-full w-full text-xs sm:text-sm"
                              >
                                {Array.from({ length: subgroups }, (_, subgroup) => {
                                  const item = itemList.find(i => i.subgroup === subgroup);

                                  return (
                                    <div
                                      key={`${subgroup}-${i}`}
                                      className="border text-xs grid place-items-center px-1 py-0.5 truncate w-1/2"
                                    >
                                      {item ? (
                                        <>
                                          <p className="truncate">{item.discipline}</p>
                                          <p className="truncate text-gray-400 text-[12px]">ауд. {item.classroom}</p>
                                        </>
                                      ) : (
                                        <p className="truncate">-</p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            );  
                          })}
                        </td>
                      );
                    }
                  )}
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import DeleteItemButton from "./DeleteItemButton";
import { Schedule, ScheduleItem, ScheduleItemWeektype, ScheduleType, scheduleTypeLabels } from "../types";
