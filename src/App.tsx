import { SearchBar } from "./components/SearchBar";
import { ResultsGrid } from "./components/ResultsGrid";

import { useBrandId } from "./hooks/useBrandId";
import { useCompareSearch } from "./hooks/useCompareSearch";

function ColumnError({ message }: { message: string }) {
  return (
    <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      {message}
    </div>
  );
}

function App() {
  const brandId = useBrandId();
  const {
    query,
    setQuery,
    catalog,
    loading,
    searchNow,
  } = useCompareSearch();

  const hasQuery = query.trim().length > 0;
  const showEmptyState =
    !loading && !hasQuery && !catalog.data;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7ed_0%,_#fafaf9_45%,_#f5f5f4_100%)]">
      <header className="border-b border-stone-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-widest text-amber-700 uppercase">
                Helium
              </p>
              <h1 className="font-display text-3xl font-bold text-stone-900 sm:text-4xl">
                Search Compare
              </h1>
              <p className="mt-1 text-sm text-stone-500">
                Search the catalog using natural language
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-600">
              <span className="font-medium text-stone-800">Brand:</span>{" "}
              {brandId || "not set"}
            </div>
          </div>

          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={searchNow}
            loading={loading}
          />
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        {!brandId ? (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Add <code className="rounded bg-white px-1">?shop=your-brand-id</code>{" "}
            to the URL, or set{" "}
            <code className="rounded bg-white px-1">VITE_BRAND_ID</code> in{" "}
            <code className="rounded bg-white px-1">.env</code>.
          </div>
        ) : null}

        {showEmptyState ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white/60 px-6 py-20 text-center">
            <p className="font-display text-2xl font-semibold text-stone-800">
              Start typing to search
            </p>
            <p className="mt-2 text-stone-500">
              Enter a query to find relevant products.
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-4xl">
            <section className="min-w-0">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-display text-xl font-semibold text-stone-900">
                  Search Results
                </h2>
                <span className="text-xs text-stone-500">POST /api/catalog-search</span>
              </div>

              {catalog.error ? <ColumnError message={catalog.error} /> : null}

              {catalog.loading ? (
                <div className="mb-6 rounded-2xl border border-stone-200 bg-white px-4 py-8 text-center text-sm text-stone-500">
                  Loading catalog results…
                </div>
              ) : null}

              {catalog.data?.results ? (
                <ResultsGrid
                  results={catalog.data.results}
                  buckets={catalog.data.meta?.buckets}
                />
              ) : !catalog.loading && hasQuery && !catalog.error ? (
                <ResultsGrid results={[]} />
              ) : null}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
