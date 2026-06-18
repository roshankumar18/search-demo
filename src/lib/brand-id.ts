const envBrandId = import.meta.env.VITE_BRAND_ID?.trim() ?? "";

/** `?shop=` URL param takes priority over VITE_BRAND_ID env. */
export function resolveBrandId(): string {
  const shop = new URLSearchParams(window.location.search).get("shop")?.trim();
  return shop || envBrandId;
}
