export function getAuthToken(): string | null {
  return localStorage.getItem("token");
}
export const setToken = (t: string) => localStorage.setItem("token", t);
export const clearToken = () => localStorage.removeItem("token");

// naive expiry check: looks for exp (seconds) in JWT payload
export function isTokenExpired(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload?.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp <= now;
  } catch {
    return true; // treat unreadable token as expired
  }
}