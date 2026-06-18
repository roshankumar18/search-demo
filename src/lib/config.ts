const apiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

export const config = {
  apiBaseUrl: apiBase,
};

export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return apiBase ? `${apiBase}${normalized}` : normalized;
}
