import type { CatalogSearchProduct } from "../types/catalog-search";

/**
 * Storefront shop domain (e.g. `kisah.in`). Reuses the `?shop=` URL param
 * — same value sent as `brandid` header to the backend API.
 */
function resolveShopDomain(): string {
  return new URLSearchParams(window.location.search).get("shop")?.trim() ?? "";
}

/**
 * Shopify product prices are in the smallest currency unit (paise for INR),
 * so divide by 100 to get the major-unit amount.
 */
function fromPaise(value: number | null | undefined): number | undefined {
  if (value == null || typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }
  return value / 100;
}

interface ShopifyProductJs {
  handle: string;
  title: string;
  description: string | null;
  type: string | null;
  available: boolean;
  featured_image: string | null;
  price: number;
  price_min: number;
  price_max: number;
  compare_at_price: number | null;
  compare_at_price_min: number | null;
  compare_at_price_max: number | null;
}

function mapShopifyProduct(p: ShopifyProductJs): CatalogSearchProduct {
  return {
    handle: p.handle,
    title: p.title,
    description: p.description ?? undefined,
    productType: p.type ?? undefined,
    image: p.featured_image ?? undefined,
    availableForSale: p.available,
    prices: {
      min: fromPaise(p.price_min),
      max: fromPaise(p.price_max),
      compareAtMin: fromPaise(p.compare_at_price_min),
      currency: "INR",
    },
  };
}

/**
 * Fetch a single product from the Shopify `.js` endpoint.
 * Returns `null` on any error so the caller can fall back to catalog data.
 */
async function fetchProductByHandle(
  shopDomain: string,
  handle: string
): Promise<CatalogSearchProduct | null> {
  const url = `https://${shopDomain}/products/${encodeURIComponent(handle)}.js`;
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      console.warn(
        `[storefront] ${handle}.js failed: ${response.status} ${response.statusText}`
      );
      return null;
    }
    const data = (await response.json()) as ShopifyProductJs;
    return mapShopifyProduct(data);
  } catch (err) {
    console.warn(`[storefront] ${handle}.js error:`, err);
    return null;
  }
}

/** Max concurrent requests — keeps the browser / Shopify happy. */
const MAX_CONCURRENCY = 8;

async function mapPool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker())
  );
  return results;
}

/**
 * Fetch product data for many handles in parallel (capped at
 * `MAX_CONCURRENCY` concurrent requests) using the Shopify `.js` endpoint.
 *
 * Returns a map of handle → enriched product. Handles that fail to fetch
 * are omitted so callers can fall back to catalog data.
 */
export async function fetchProductsByHandles(
  handles: string[]
): Promise<Record<string, CatalogSearchProduct>> {
  const shopDomain = resolveShopDomain();
  if (!shopDomain || handles.length === 0) {
    return {};
  }

  const enriched = await mapPool(handles, MAX_CONCURRENCY, (handle) =>
    fetchProductByHandle(shopDomain, handle)
  );

  const out: Record<string, CatalogSearchProduct> = {};
  handles.forEach((handle, i) => {
    const product = enriched[i];
    if (product) {
      out[handle] = product;
    }
  });
  return out;
}

/**
 * Merge Shopify-enriched fields into catalog search results.
 * Catalog-only fields (bucket, subcategory) are preserved; everything else
 * is overwritten by the Shopify response when available.
 */
export function enrichCatalogResults(
  results: CatalogSearchProduct[],
  enriched: Record<string, CatalogSearchProduct>
): CatalogSearchProduct[] {
  if (Object.keys(enriched).length === 0) return results;
  return results.map((product) => {
    const e = enriched[product.handle];
    if (!e) return product;
    return {
      ...e,
      // preserve catalog-only fields not returned by Shopify
      subcategory: product.subcategory ?? e.subcategory,
      bucket: product.bucket,
      prices: {
        ...e.prices,
        // fall back to catalog prices if Shopify didn't return them
        min: e.prices.min ?? product.prices.min,
        max: e.prices.max ?? product.prices.max,
        compareAtMin: e.prices.compareAtMin ?? product.prices.compareAtMin,
        currency: e.prices.currency ?? product.prices.currency,
      },
    };
  });
}