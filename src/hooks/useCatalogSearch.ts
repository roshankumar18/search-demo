import { useCallback, useEffect, useRef, useState } from "react";
import { searchCatalog } from "../lib/api";
import type { CatalogSearchResponse } from "../types/catalog-search";

interface UseCatalogSearchOptions {
  debounceMs?: number;
  limit?: number;
}

export function useCatalogSearch(options?: UseCatalogSearchOptions) {
  const debounceMs = options?.debounceMs ?? 400;
  const limit = options?.limit ?? 24;

  const [query, setQuery] = useState("");
  const [data, setData] = useState<CatalogSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const runSearch = useCallback(
    async (searchQuery: string) => {
      const trimmed = searchQuery.trim();
      if (!trimmed) {
        setData(null);
        setError(null);
        setLoading(false);
        return;
      }

      const id = ++requestId.current;
      setLoading(true);
      setError(null);

      try {
        const result = await searchCatalog({ query: trimmed, limit });
        if (id === requestId.current) {
          setData(result);
        }
      } catch (err) {
        if (id === requestId.current) {
          setData(null);
          setError(err instanceof Error ? err.message : "Search failed");
        }
      } finally {
        if (id === requestId.current) {
          setLoading(false);
        }
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
    data,
    loading,
    error,
    searchNow,
  };
}
