export enum ScheduleType {
    cycled = "cycled",
    calendar = "calendar"
}

export const scheduleTypeLabels: Record<ScheduleType, string> = {
  [ScheduleType.cycled]: "циклическое",
  [ScheduleType.calendar]: "календарное"
};

export enum ScheduleItemWeektype {
    even = 0,
    odd = 1,
    both = 2
}

enum ScheduleItemLectureType {
    lecture = "lecture",
	practice = "practice",
	seminar = "seminar",
	exam = "exam",
	laboratory = "laboratory",
}

export interface ScheduleItem {
    discipline: string;
    teacher_id: string;
    weekday: string;
    students_count: number;
    date?: Date;
    lesson_number: number;
    subgroup: number;
    weektype?: ScheduleItemWeektype;
    weeknum?: number;
    lesson_type: ScheduleItemLectureType;
    classroom: string;
}

export interface Schedule {
    id: string;
    edu_group_id: string;
    semester: number,
    type: ScheduleType;
    start_date?: Date;
    end_date?: Date;
    items?: ScheduleItem[]
}