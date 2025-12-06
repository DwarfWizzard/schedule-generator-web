function getApiBaseUrl(): string {
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

export async function apiFetch<T = any>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const base = getApiBaseUrl();
  const res = await fetch(base + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {})
    },
  });

  const data: ApiResponse<T> = await res.json();

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

export function getApiUrl(): string {
  return getApiBaseUrl();
}