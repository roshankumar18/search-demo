const apiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

export const config = {
  apiBaseUrl: apiBase,
};

export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return apiBase ? `${apiBase}${normalized}` : normalized;
}

const isNgrok = apiBase.includes("ngrok");

/** Required for ngrok free tier (ERR_NGROK_6024) on programmatic requests */
export function apiFetchHeaders(
  extra: Record<string, string> = {}
): Record<string, string> {
  if (!isNgrok) {
    return extra;
  }
  return { ...extra, "ngrok-skip-browser-warning": "true" };
}
