import type { CatalogSearchMeta } from "../types/catalog-search";

interface SearchMetaProps {
  meta: CatalogSearchMeta;
  total?: number;
}

function Chip({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "success" | "warn" | "info";
}) {
  const tones = {
    neutral: "bg-stone-100 text-stone-700",
    success: "bg-emerald-100 text-emerald-800",
    warn: "bg-amber-100 text-amber-900",
    info: "bg-sky-100 text-sky-900",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {label}
    </span>
  );
}

export function SearchMeta({ meta, total }: SearchMetaProps) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {meta.conceptApplied && meta.conceptName ? (
          <Chip label={`Concept: ${meta.conceptName}`} tone="success" />
        ) : (
          <Chip label="No concept match" tone="neutral" />
        )}
        {meta.sector ? <Chip label={`Sector: ${meta.sector}`} tone="info" /> : null}
        {meta.fallbackTriggered ? (
          <Chip label="Fallback search" tone="warn" />
        ) : null}
        {meta.rerankApplied ? <Chip label="Reranked" tone="info" /> : null}
        {meta.parallelRetrievalApplied ? (
          <Chip label="Parallel retrieval" tone="info" />
        ) : null}
        {total != null ? (
          <Chip label={`~${total} hits`} tone="neutral" />
        ) : null}
      </div>

      <dl className="grid gap-2 text-sm text-stone-600">
        <div>
          <dt className="font-medium text-stone-800">Meili query</dt>
          <dd className="mt-0.5 font-mono text-xs break-all text-stone-500">
            {meta.meiliQuery}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-stone-800">Filter</dt>
          <dd className="mt-0.5 font-mono text-xs break-all text-stone-500">
            {meta.meiliFilter}
          </dd>
        </div>
        {meta.userMustApplied.length > 0 ? (
          <div>
            <dt className="font-medium text-stone-800">User filters</dt>
            <dd className="mt-1 flex flex-wrap gap-1.5">
              {meta.userMustApplied.map((clause) => (
                <Chip key={clause} label={clause} />
              ))}
            </dd>
          </div>
        ) : null}
        {meta.intelligenceFiltersApplied.length > 0 ? (
          <div>
            <dt className="font-medium text-stone-800">Intelligence filters</dt>
            <dd className="mt-1 flex flex-wrap gap-1.5">
              {meta.intelligenceFiltersApplied.map((clause) => (
                <Chip key={clause} label={clause} tone="info" />
              ))}
            </dd>
          </div>
        ) : null}
        {meta.candidateCounts ? (
          <div>
            <dt className="font-medium text-stone-800">Candidates</dt>
            <dd className="mt-1 flex flex-wrap gap-1.5">
              {Object.entries(meta.candidateCounts).map(([key, count]) => (
                <Chip key={key} label={`${key}: ${count}`} />
              ))}
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}
