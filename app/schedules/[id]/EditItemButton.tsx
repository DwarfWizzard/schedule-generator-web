"use client";

import { useState } from "react";
import { Edit3, Trash2, X } from "lucide-react";
import AddOrEditItemPage from "./add-item/AddOrEditPage";
import { ScheduleItem, weekdayLables } from "../types";

export default function EditItemButton({ scheduleId, item }: { scheduleId: string, item: ScheduleItem }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsEditModalOpen(true)}
        className="
          absolute top-1 left-1 
          hidden group-hover:flex
          items-center justify-center
          p-0.5 rounded-md bg-white shadow
          hover:bg-blue-100 transition
        "
      >
        <Edit3 className="w-3 h-3 text-blue-500" />
      </button>

      {/* Модал с предзаполненной формой */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header модала */}
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Редактировать занятие</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 hover:bg-gray-200 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Форма с предзаполненными данными */}
            <div className="p-6">
              <AddOrEditItemPage
                scheduleId={scheduleId}
                item={item}
                onSuccess={() => setIsEditModalOpen(false)}
                onCancel={() => setIsEditModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}