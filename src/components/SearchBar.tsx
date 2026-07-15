interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  loading = false,
  placeholder = "Search products…",
}: SearchBarProps) {
  return (
    <div className="w-full space-y-3">
      <form
        className="relative flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-stone-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <title>Search</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
            />
          </svg>
          <input
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="w-full rounded-2xl border border-stone-200 bg-white py-3.5 pr-4 pl-12 text-base text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
          />
          {loading ? (
            <span className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          ) : null}
        </div>
        <button
          type="submit"
          className="rounded-2xl bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:opacity-50"
          disabled={loading || !value.trim()}
        >
          Search
        </button>
      </form>
    </div>
  );
}
