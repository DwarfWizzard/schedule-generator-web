"use client";

import { useRouter } from "next/navigation";
import { handleApiResponse, formatApiError } from "../../utils/api";
import { getPublicApiBaseUrl } from "@/app/apiFetch";

export default function DeleteCabinetButton({ cabinetId }: { cabinetId: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Вы уверены, что хотите удалить этот кабинет? Это действие нельзя отменить.")) {
      return;
    }

    try {
      const response = await fetch(`${getPublicApiBaseUrl()}/v1/cabinets/${cabinetId}`, {
        method: "DELETE",
      });

      await handleApiResponse(response);

      router.push("/cabinets");
      router.refresh();
    } catch (error) {
      alert("Ошибка: " + formatApiError(error));
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
    >
      Удалить кабинет
    </button>
  );
}

