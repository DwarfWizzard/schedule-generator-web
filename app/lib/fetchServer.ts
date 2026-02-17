'use server'

import { cookies } from "next/headers";
import { apiFetch, ApiResponse, getAccessToken, getServerApiBaseUrl } from "./apiFetch";


export async function apiFetchServer<T = object>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
 const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  let token: string | null = null;
  
  try {
    const cookieStore = await cookies(); // ← await!
    token = cookieStore.get('access_token')?.value || null;
  } catch (error) {
    console.error('Failed to read cookies in apiFetchServer:', error);
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Клиентская логика (если вдруг вызвали на клиенте)
  if (typeof window !== 'undefined') {
    const clientToken = getAccessToken();
    if (clientToken) {
      headers.Authorization = `Bearer ${clientToken}`;
    }
  }

  return apiFetch<T>(path, getServerApiBaseUrl(), { ...options, headers });
}