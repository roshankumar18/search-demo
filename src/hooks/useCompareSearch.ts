import { useCallback, useEffect, useRef, useState } from "react";
import { searchCatalog, searchLegacyProducts } from "../lib/api";
import { mapLegacyProducts } from "../lib/map-legacy-product";
import {
  enrichCatalogResults,
  fetchProductsByHandles,
} from "../lib/storefront";
import type { CatalogSearchResponse } from "../types/catalog-search";
import type { LegacySearchResponse } from "../types/legacy-search";

interface UseCompareSearchOptions {
  debounceMs?: number;
  limit?: number;
}

interface SearchSideState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useCompareSearch(options?: UseCompareSearchOptions) {
  const debounceMs = options?.debounceMs ?? 400;
  const limit = options?.limit ?? 24;

  const [query, setQuery] = useState("");
  const [catalog, setCatalog] = useState<SearchSideState<CatalogSearchResponse>>({
    data: null,
    loading: false,
    error: null,
  });
  const [legacy, setLegacy] = useState<SearchSideState<LegacySearchResponse>>({
    data: null,
    loading: false,
    error: null,
  });
  const requestId = useRef(0);

  const runSearch = useCallback(
    async (searchQuery: string) => {
      const trimmed = searchQuery.trim();
      if (!trimmed) {
        setCatalog({ data: null, loading: false, error: null });
        setLegacy({ data: null, loading: false, error: null });
        return;
      }

      const id = ++requestId.current;
      setCatalog((prev) => ({ ...prev, loading: true, error: null }));
      setLegacy((prev) => ({ ...prev, loading: true, error: null }));

      const [catalogResult, legacyResult] = await Promise.allSettled([
        searchCatalog({ query: trimmed, limit }),
        searchLegacyProducts({ query: trimmed, limit }),
      ]);

      if (id !== requestId.current) {
        return;
      }

      if (catalogResult.status === "fulfilled") {
        const base = catalogResult.value;
        const handles = base.results.map((p) => p.handle);
        const enriched = await fetchProductsByHandles(handles);
        if (id !== requestId.current) {
          return;
        }
        setCatalog({
          data: {
            ...base,
            results: enrichCatalogResults(base.results, enriched),
          },
          loading: false,
          error: null,
        });
      } else {
        setCatalog({
          data: null,
          loading: false,
          error:
            catalogResult.reason instanceof Error
              ? catalogResult.reason.message
              : "Catalog search failed",
        });
      }

      if (legacyResult.status === "fulfilled") {
        setLegacy({
          data: legacyResult.value,
          loading: false,
          error: null,
        });
      } else {
        setLegacy({
          data: null,
          loading: false,
          error:
            legacyResult.reason instanceof Error
              ? legacyResult.reason.message
              : "Legacy search failed",
        });
      }
    },
    [limit]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void runSearch(query);
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [query, debounceMs, runSearch]);

  const searchNow = useCallback(() => {
    void runSearch(query);
  }, [query, runSearch]);

  const legacyProducts = legacy.data?.result.products
    ? mapLegacyProducts(legacy.data.result.products)
    : [];

  return {
    query,
    setQuery,
    catalog,
    legacy,
    legacyProducts,
    loading: catalog.loading || legacy.loading,
    searchNow,
  };
}
