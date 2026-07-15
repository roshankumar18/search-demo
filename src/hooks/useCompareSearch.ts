import { useCallback, useEffect, useRef, useState } from "react";
import { searchCatalog } from "../lib/api";
import {
  enrichCatalogResults,
  fetchProductsByHandles,
} from "../lib/storefront";
import type { CatalogSearchResponse } from "../types/catalog-search";

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

  const requestId = useRef(0);

  const runSearch = useCallback(
    async (searchQuery: string) => {
      const trimmed = searchQuery.trim();
      if (!trimmed) {
        setCatalog({ data: null, loading: false, error: null });
        return;
      }

      const id = ++requestId.current;
      setCatalog((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const catalogResult = await searchCatalog({ query: trimmed, limit });
        if (id !== requestId.current) return;

        const handles = catalogResult.results.map((p) => p.handle);
        const enriched = await fetchProductsByHandles(handles);
        if (id !== requestId.current) return;

        setCatalog({
          data: {
            ...catalogResult,
            results: enrichCatalogResults(catalogResult.results, enriched),
          },
          loading: false,
          error: null,
        });
      } catch (error) {
        if (id !== requestId.current) return;

        setCatalog({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : "Catalog search failed",
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

  return {
    query,
    setQuery,
    catalog,
    loading: catalog.loading,
    searchNow,
  };
}
