"use client";

import { apiFetchClient, getPublicApiBaseUrl } from "@/app/apiFetch";
import { ScheduleItem, ScheduleItemLectureType, scheduleItemLectureTypeLabels, ScheduleItemWeektype, scheduleItemWeektypeLabels, weekdayLables } from "../../types";
import { formatApiError, handleApiResponse } from "@/app/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Teacher } from "@/app/teachers/types";
import { Cabinet } from "@/app/cabinets/types";

export default function AddOrEditItemPage({ scheduleId, item, onSuccess, onCancel }: { scheduleId: string, item?: ScheduleItem,  onSuccess?: () => void, onCancel?: () => void}) {
    const router = useRouter();

    const [lessonNumber, setLessonNumber] = useState(item ? item.lesson_number : 0);
    const [subgroup, setSubgroup] = useState(item ? item.subgroup : 0);
    const [weekday, setWeekday] = useState(item ? weekdayLables.indexOf(item.weekday) : 1);
    const [weektype, setWeektype] = useState(item ? item.weektype : ScheduleItemWeektype.both)
    const [lessontype, setLessonType] = useState(item ? item.lesson_type : ScheduleItemLectureType.lecture)
    const [discipline, setDiscipline] = useState(item ? item.discipline : "");
    const [teacherId, setTeacherId] = useState(item ? item.teacher_id : "");
    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [cabinets, setCabinets] = useState<Record<string, Cabinet[]>>({})
    const [selectedBuilding, setSelectedBuilding] = useState<string>('');
    const [selectedAuditorium, setSelectedAuditorium] = useState<string>('');
    const [selectedCabinetId, setSelectedCabinetId] = useState<string>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchTeachers() {
        try {
            const data = await apiFetchClient<Teacher[]>("/v1/teachers");
            setTeachers(data.response || []);
        } catch (error) {
            console.error("Error fetching teacher:", error);
        }
        }
        fetchTeachers();
    }, []);

    useEffect(() => {
        async function fetchCabinets() {
        try {
            const data = await apiFetchClient<Cabinet[]>("/v1/cabinets");
            if (!data.response) return;

            let cabinetsMap: Record<string, Cabinet[]> = {}
            data.response.forEach((cabinet: Cabinet) => {
                if (!cabinetsMap[cabinet.building]) {
                    cabinetsMap[cabinet.building] = []
                }

                cabinetsMap[cabinet.building].push(cabinet)
            })

            setCabinets(cabinetsMap)
        } catch (error) {
            console.error("Error fetching teacher:", error);
        }
        }
        fetchCabinets();
    }, []);

    useEffect(() => {
        if (item && cabinets) {
            // Найти cabinet по classroom
            const matchingCabinet = Object.values(cabinets)
            .flat()
            .find(cabinet => cabinet.auditorium === item.cabinet_auditorium);
            
            if (matchingCabinet) {
                setSelectedBuilding(matchingCabinet.building);
                setSelectedAuditorium(matchingCabinet.auditorium);
                setSelectedCabinetId(matchingCabinet.id);
            }
        }
    }, [item, cabinets]);
        
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true)

        try {
            const payload = {
                    discipline: discipline,
                    teacher_id: teacherId,
                    weekday: weekday,
                    lesson_number: lessonNumber,
                    subgroup: subgroup,
                    weektype: Number(weektype),
                    lesson_type: Number(lessontype),
                    cabinet_id: selectedCabinetId,
                }
            const response = await fetch(`${getPublicApiBaseUrl()}/v1/schedules/${scheduleId}/items`, {
                method: !item ? "POST" : "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(!item ? [payload] : payload),
            });

            await handleApiResponse(response);

            if (onSuccess) {
                onSuccess()
            }

            router.push(`/schedules/${scheduleId}`);
            router.refresh();
        } catch (error) {
            alert("Ошибка: " + formatApiError(error));
            setLoading(false);
        }
    }

    const weekdays = [
        { value: 1, label: "Понедельник" },
        { value: 2, label: "Вторник" },
        { value: 3, label: "Среда" },
        { value: 4, label: "Четверг" },
        { value: 5, label: "Пятница" },
        { value: 6, label: "Суббота" },
    ];

    const buildingOptions = Object.keys(cabinets).map(building => ({
        value: building,
        label: building
    }));

    const auditoriumOptions = selectedBuilding && cabinets[selectedBuilding] 
    ? cabinets[selectedBuilding]
        .filter(cabinet => cabinet.auditorium)
        .map(cabinet => ({
            value: cabinet.auditorium!,
            label: cabinet.auditorium!
        }))
        .filter((item, index, self) => 
            index === self.findIndex(t => t.value === item.value)
        ) // Уникальные
    : [];

    const isFormValid = discipline && 
                   teacherId && 
                   selectedCabinetId && 
                   lessonNumber >= 0;

    
    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            День недели
          </label>
          <select
            value={item ? weekdayLables.indexOf(item.weekday) : weekday}
            onChange={(e) => {
                if (item) return;
                setWeekday(Number(e.target.value))
            }}
            disabled={item != null}
            required
            className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500 ${
                    item
                        ? 'bg-gray-100 cursor-not-allowed border-gray-200'
                        : 'border-gray-300'
                    }`}
          >
            {weekdays.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Номер пары
          </label>
          <input
            type="number"
            value={item ? item.lesson_number+1 : lessonNumber+1}
            onChange={(e) => {
                if (item) return;
                setLessonNumber(Number(e.target.value)-1)
            }}
            disabled={item != null}
            required
            min="1"
            max="8"
            className={`w-full border border-gray-300 text-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    item
                        ? 'bg-gray-100 cursor-not-allowed border-gray-200'
                        : 'border-gray-300'
                    }`}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Тип недели
          </label>
          <select
            value={item ? item.weektype : weektype}
            onChange={(e) => {
                if (item) return;
                setWeektype(Number(e.target.value))
            }}
            disabled={item != null}
            required
            className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500 ${
                    item
                        ? 'bg-gray-100 cursor-not-allowed border-gray-200'
                        : 'border-gray-300'
                    }`}
          >
            <option value="">Выберите тип недели</option>
            {(Object.keys(scheduleItemWeektypeLabels) as unknown as ScheduleItemWeektype[]).map(
              (key) => (
                <option key={key} value={key}>
                  {scheduleItemWeektypeLabels[key]}
                </option>
              )
            )}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Предмет
          </label>
          <input
            type="text"
            value={discipline}
            defaultValue={item ? item.discipline : undefined}
            onChange={(e) => setDiscipline(e.target.value)}
            required
            className="w-full border border-gray-300 text-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Введите название предмета"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Преподаватель
          </label>
          <select
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500"
          >
            <option value={item ? item.teacher_id : ""} key={item ? item.teacher_id : ""}>{item ? item.teacher_name : "Выберите преподавателя"}</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Тип занятия
          </label>
          <select
            value={lessontype}
            onChange={(e) => setLessonType(Number(e.target.value))}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500"
          >
            <option value={item ? item.lesson_type : ""} key={item ? item.lesson_type : ""}>{item ? item.lesson_type : "Выберите тип занятия"}</option>
            {(Object.keys(scheduleItemLectureTypeLabels) as unknown as ScheduleItemLectureType[]).map(
              (key) => (
                <option key={key} value={key}>
                  {scheduleItemLectureTypeLabels[key]}
                </option>
              )
            )}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Подгруппа (значение 0 указывает, что занятие для всех подгрупп)
          </label>
          <input
            type="number"
            value={item ? item.subgroup : subgroup}
            onChange={(e) => {
                if (item) return;
                setSubgroup(Number(e.target.value))
            }}
            disabled={item != null}
            required
            min="0"
            className={`w-full border border-gray-300 text-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    item
                        ? 'bg-gray-100 cursor-not-allowed border-gray-200'
                        : 'border-gray-300'
                    }`}
          />
        </div>

        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Выберите корпус
            </label>
            <select
                value={selectedBuilding}
                onChange={(e) => {
                    setSelectedBuilding(e.target.value);
                    setSelectedAuditorium('');
                    setSelectedCabinetId('');
                }}
                required
                className="w-full border border-gray-300 text-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
                {item && selectedBuilding ? (
                    <option value={selectedBuilding}>{selectedBuilding}</option>
                ) : (
                    <option value="">Выберите корпус</option>
                )}
                {buildingOptions.map(building => (
                    <option key={building.value} value={building.value}>
                        {building.label}
                    </option>
                ))}
            </select>
        </div>

        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Выберите аудиторию
            </label>
            <select
                value={selectedAuditorium}
                onChange={(e) => {
                    const selectedAuditorium = e.target.value;
                    setSelectedAuditorium(selectedAuditorium);
                    
                    // Найти Cabinet по building + auditorium
                    if (selectedBuilding && selectedAuditorium && cabinets[selectedBuilding]) {
                        const cabinet = cabinets[selectedBuilding].find(
                            c => c.auditorium === selectedAuditorium
                        );
                        setSelectedCabinetId(cabinet ? cabinet.id : "");
                    }
                }}
                disabled={!selectedBuilding}
                required
                
                className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500 transition-colors ${
                    !selectedBuilding
                        ? 'bg-gray-100 cursor-not-allowed border-gray-200'
                        : 'border-gray-300'
                    }`}
            >
                {item && selectedBuilding ? (
                    <option value={selectedBuilding}>{item.cabinet_auditorium}</option>
                ) : (
                    <option value="">Выберите аудиторию</option>
                )}
                {auditoriumOptions.map(auditorium => (
                <option key={auditorium.value} value={auditorium.value}>
                    {auditorium.label}
                </option>
                ))}
            </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading 
                ? (item ? "Обновление..." : "Добавление...") 
                : (item ? "Обновить" : "Добавить")
            }
          </button>
          <button
            type="button"
            onClick={() => {
                if (onCancel) {
                    onCancel()
                }
                
                router.back()
            }}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition"
          >
            Отмена
          </button>
        </div>
      </form>
    )
}