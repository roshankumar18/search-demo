interface LegacySearchSummaryProps {
  total: number;
  resultCount: number;
  filters?: Record<string, Record<string, number>>;
}

export function LegacySearchSummary({
  total,
  resultCount,
  filters,
}: LegacySearchSummaryProps) {
  const filterKeys = filters ? Object.keys(filters) : [];

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700">
          Legacy search
        </span>
        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700">
          ~{total} hits
        </span>
        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700">
          Showing {resultCount}
        </span>
      </div>
      <p className="text-sm text-stone-600">
        GET /api/search/products — hybrid Meilisearch with price/category heuristics.
      </p>
      {filterKeys.length > 0 ? (
        <p className="mt-2 text-xs text-stone-500">
          Facets: {filterKeys.join(", ")}
        </p>
      ) : null}
    </div>
  );
}
