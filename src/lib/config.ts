const apiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

export const config = {
  apiBaseUrl: apiBase,
};

export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return apiBase ? `${apiBase}${normalized}` : normalized;
}

/** ngrok free tier shows an interstitial (ERR_NGROK_6024) unless this header is sent */
export function apiFetchHeaders(
  extra: Record<string, string> = {}
): Record<string, string> {
  const headers = { ...extra };
  if (apiBase.includes("ngrok")) {
    headers["ngrok-skip-browser-warning"] = "true";
  }
  return headers;
}
