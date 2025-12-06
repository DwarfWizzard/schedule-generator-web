export function getApiUrl(): string {
  if (typeof window !== "undefined") {
    // Client-side
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  }
  // Server-side
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
}

export interface ApiResponse<T = any> {
  status: number;
  response?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;
  apiMessage?: string;

  constructor(status: number, message?: string, errors?: Record<string, string[]>) {
    const errorMessage = message || `API error: ${status}`;
    super(errorMessage);
    this.name = "ApiError";
    this.status = status;
    this.apiMessage = message;
    this.errors = errors;
  }
}

export async function handleApiResponse<T = any>(response: Response): Promise<ApiResponse<T>> {
  const data: ApiResponse<T> = await response.json();

  // Проверяем статус из ответа API, а не HTTP статус
  if (data.status < 200 || data.status >= 300) {
    throw new ApiError(
      data.status,
      data.message,
      data.errors
    );
  }

  return data;
}

export function formatApiError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.errors) {
      const errorMessages = Object.entries(error.errors)
        .flatMap(([field, messages]) => messages.map(msg => `${field}: ${msg}`));
      return errorMessages.join("\n");
    }
    return error.apiMessage || error.message || `Ошибка ${error.status}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Неизвестная ошибка";
}

