import { parseJwt } from "./jwt";

export function getPublicApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008";
}

export function getServerApiBaseUrl(): string {
  return process.env.API_URL || "http://localhost:8008";
}

export interface ApiResponse<T = object> {
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

// Глобальное состояние для рефреша токена
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: ApiResponse<any>) => void;
  reject: (reason?: any) => void;
}> = [];

export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
};

const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);

  const payload = parseJwt(accessToken);
  if (payload) {
    localStorage.setItem('user_payload', JSON.stringify(payload));
  } else {
    localStorage.removeItem('user_payload');
  }

  document.cookie = `access_token=${accessToken}; path=/; max-age=3600`;
};

export const removeTokens = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_payload');
  document.cookie = 'access_token=; path=/; max-age=0';
};

const refreshToken = async (): Promise<boolean> => {
  const refreshTokenValue = getRefreshToken();
  if (!refreshTokenValue) return false;

  try {
    const response = await fetch(`${getPublicApiBaseUrl()}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refreshTokenValue }),
    });

    const data: ApiResponse<any> = await response.json();

    if (data.status === 200 && data.response?.access_token && data.response?.refresh_token) {
      setTokens(data.response.access_token, data.response.refresh_token);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

const processQueue = (error: any, token?: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token as any);
    }
  });
  failedQueue = [];
};

export async function apiFetch<T = object>(
  path: string,
  base: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  console.log(`${base}${path}`);

  const accessToken = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options?.headers || {}),
    },
  });

  let data: ApiResponse<T>;
  try {
    data = await res.json();
  } catch {
    data = { status: 500, message: 'Ошибка парсинга ответа' } as ApiResponse<T>;
  }

  if (data.status < 200 || data.status >= 300) {
    // Обработка 401 ошибки
    if (data.status === 401 && base === getPublicApiBaseUrl()) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiFetch<T>(path, base, options))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      const refreshed = await refreshToken();
      processQueue(null, refreshed ? getAccessToken() : null);
      isRefreshing = false;

      if (refreshed) {
        return apiFetch<T>(path, base, {
          ...options,
          headers: { ...headers, Authorization: `Bearer ${getAccessToken()}` },
        });
      } else {
        removeTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/cabinets/login';
        }
        throw new ApiError(401, 'Сессия истекла. Пожалуйста, войдите снова.');
      }
    }

    throw new ApiError(data.status, data.message, data.errors);
  }

  return data;
}

export function apiFetchClient<T = object>(path: string, options?: RequestInit) {
  return apiFetch<T>(path, getPublicApiBaseUrl(), { ...options });
}

// Функция выхода
export const logout = () => {
  removeTokens();
  if (typeof window !== 'undefined') {
    window.location.href = '/cabinets/login';
  }
};

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
