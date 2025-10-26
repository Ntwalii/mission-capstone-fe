import { getAuthToken, clearToken } from "@/utils/auth";

export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = getAuthToken();
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(input, { ...init, headers });
  if (res.status === 401) {
    clearToken();
    // Optional: redirect to /auth here if you prefer
  }
  return res;
}
