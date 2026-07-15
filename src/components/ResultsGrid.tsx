import { ProductCard } from "./ProductCard";
import type { CatalogSearchProduct } from "../types/catalog-search";

interface ResultsGridProps {
  results: CatalogSearchProduct[];
  buckets?: Record<string, string[]>;
}

function groupByBucket(
  results: CatalogSearchProduct[],
  buckets?: Record<string, string[]>
): Array<{ label: string; products: CatalogSearchProduct[] }> {
  if (!buckets || Object.keys(buckets).length === 0) {
    return [{ label: "All results", products: results }];
  }

  const handleToBucket = new Map<string, string>();
  for (const [bucket, handles] of Object.entries(buckets)) {
    for (const handle of handles) {
      handleToBucket.set(handle, bucket);
    }
  }

  const grouped = new Map<string, CatalogSearchProduct[]>();
  const bucketOrder = Object.keys(buckets);

  for (const product of results) {
    const bucket =
      product.bucket ??
      handleToBucket.get(product.handle) ??
      "Other";
    const list = grouped.get(bucket) ?? [];
    list.push(product);
    grouped.set(bucket, list);
  }

  const orderedLabels = [
    ...bucketOrder,
    ...[...grouped.keys()].filter((label) => !bucketOrder.includes(label)),
  ];

  return orderedLabels
    .filter((label) => grouped.has(label))
    .map((label) => ({
      label,
      products: grouped.get(label) ?? [],
    }));
}

export function ResultsGrid({ results, buckets }: ResultsGridProps) {
  if (results.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
        <p className="text-lg font-medium text-stone-700">No products found</p>
        <p className="mt-1 text-sm text-stone-500">
          Try a different query or relax filters in the API.
        </p>
      </div>
    );
  }

  const sections = groupByBucket(results, buckets);

  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <section key={section.label}>
          {sections.length > 1 ? (
            <h2 className="mb-4 font-display text-xl font-semibold text-stone-900">
              {section.label}
              <span className="ml-2 text-sm font-normal text-stone-500">
                ({section.products.length})
              </span>
            </h2>
          ) : null}
          <div className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mb-4 scrollbar-thin">
            {section.products.map((product) => (
              <div key={product.handle} className="w-[260px] flex-shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
