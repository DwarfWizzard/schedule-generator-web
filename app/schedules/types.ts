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

export const scheduleItemWeektypeLabels: Record<ScheduleItemWeektype, string> = {
  [ScheduleItemWeektype.even]: "четная неделя",
  [ScheduleItemWeektype.odd]:  "нечетная неделя",
  [ScheduleItemWeektype.both]: "все недели",
};

export const weekdayLables = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

export enum ScheduleItemLectureType {
    lecture = 0,
	practice = 1,
	seminar = 2,
	exam = 3,
	laboratory = 4,
}

export const scheduleItemLectureTypeLabels: Record<ScheduleItemLectureType, string> = {
  [ScheduleItemLectureType.lecture]: "лекция",
  [ScheduleItemLectureType.practice]: "практика",
  [ScheduleItemLectureType.seminar]: "семинар",
  [ScheduleItemLectureType.exam]: "экзамен",
  [ScheduleItemLectureType.laboratory]: "лабораторная",
};

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
    edu_group_number: string;
    semester: number,
    type: ScheduleType;
    start_date?: Date;
    end_date?: Date;
    items?: ScheduleItem[]
}