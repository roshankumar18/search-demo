import { apiUrl, apiFetchHeaders } from "./config";
import { resolveBrandId } from "./brand-id";
import type {
  CatalogSearchRequest,
  CatalogSearchResponse,
} from "../types/catalog-search";
import type { LegacySearchResponse } from "../types/legacy-search";

function requireBrandId(): string {
  const brandId = resolveBrandId();
  if (!brandId) {
    throw new Error(
      "Add ?shop=your-brand-id to the URL or set VITE_BRAND_ID in .env"
    );
  }
  return brandId;
}

export async function searchCatalog(
  input: CatalogSearchRequest
): Promise<CatalogSearchResponse> {
  const brandId = requireBrandId();

  const response = await fetch(apiUrl("/api/catalog-search"), {
    method: "POST",
    headers: apiFetchHeaders({
      "Content-Type": "application/json",
      brandid: brandId,
    }),
    body: JSON.stringify({
      query: input.query,
      limit: input.limit ?? 24,
      offset: input.offset ?? 0,
      filter: input.filter || undefined,
      sort: input.sort?.length ? input.sort : undefined,
    }),
  });

  const data = (await response.json()) as CatalogSearchResponse;

  if (!response.ok) {
    throw new Error(data.error ?? `Search failed (${response.status})`);
  }

  return data;
}

export async function searchLegacyProducts(input: {
  query: string;
  limit?: number;
  offset?: number;
}): Promise<LegacySearchResponse> {
  const brandId = requireBrandId();
  const params = new URLSearchParams({
    query: input.query,
    limit: String(input.limit ?? 24),
    offset: String(input.offset ?? 0),
    brandid: brandId,
  });

  // brandid in query string — avoids CORS preflight on GET (custom headers trigger OPTIONS)
  const response = await fetch(apiUrl(`/api/search/products?${params.toString()}`), {
    headers: apiFetchHeaders(),
  });

  const data = (await response.json()) as LegacySearchResponse & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? `Legacy search failed (${response.status})`);
  }

  return data;
}
