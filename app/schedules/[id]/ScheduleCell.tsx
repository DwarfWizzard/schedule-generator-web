"use client";

import { ScheduleItem, scheduleItemLectureTypeLabels, ScheduleItemWeektype } from "../types";
import DeleteItemButton from "./DeleteItemButton";

export function ScheduleCell({scheduleId, item, fullSize, fullCell}: { scheduleId: string; item: ScheduleItem | null; fullSize: boolean, fullCell: boolean}) {
  const getWeekTypeClass = (weektype: ScheduleItemWeektype | undefined): string => {
    if (weektype === undefined) {
      return 'bg-white-50 bg-opacity-5';
    }

    switch (weektype) {
      case ScheduleItemWeektype.both:
        return 'bg-white-50 bg-opacity-5';
      case ScheduleItemWeektype.even:
        return 'bg-green-200 bg-opacity-5';
      case ScheduleItemWeektype.odd:
        return 'bg-blue-200 bg-opacity-5';
      default:
        return '';
    }
  };
  
  if (fullSize) {
    if (!item) return;

    console.log(item)

    return (
      <div
        className={`w-full ${fullCell ? `` : `border`} text-xs grid place-items-center px-1 py-0.5 truncate relative group ${getWeekTypeClass(item.weektype)}`}
      >
        <p className="truncate text-gray-400 text-[10px]">{scheduleItemLectureTypeLabels[item.lesson_type]}</p>
        <p className="truncate">{item.discipline}</p>
        <p className="truncate text-gray-400 text-[12px]">ауд. {item.classroom}</p>
        <p className="truncate text-gray-400 text-[10px]">{item.teacher_name.replace(/(.+) (.).+ (.).+/, '$1 $2. $3.')}</p>

        <DeleteItemButton
        scheduleId={scheduleId}
        item={item}
        />
      </div>
    );
  }

    return (
        <div
          className={`${fullCell ? `border-l border-r`: `border`} text-xs grid place-items-center px-1.5 py-0.5 truncate w-1/2 relative group ${getWeekTypeClass(item?.weektype)}}`}
        >
          {item ? (
            <>
              <p className="truncate text-gray-400 text-[10px]">{scheduleItemLectureTypeLabels[item.lesson_type]}</p>
              <p className="truncate">{item.discipline}</p>
              <p className="truncate text-gray-400 text-[10px]">ауд. {item.classroom}</p>
              <p className="truncate text-gray-400 text-[10px]">{item.teacher_name.replace(/(.+) (.).+ (.).+/, '$1 $2. $3.')}</p>
            </>
          ) : (
            <p className="truncate text-[30px]">-</p>
          )}

          {item && (
            <DeleteItemButton
            scheduleId={scheduleId}
            item={item}
            />
        )}
        </div>
    );
}
