import { formatPrice, formatPriceRange } from "../lib/format-price";
import type { CatalogSearchProduct } from "../types/catalog-search";

interface ProductCardProps {
  product: CatalogSearchProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { prices } = product;
  const currency = prices.currency ?? "INR";
  const hasCompareAt =
    prices.compareAtMin != null &&
    prices.min != null &&
    prices.compareAtMin > prices.min;
  const isRange =
    prices.min != null && prices.max != null && prices.min !== prices.max;
  const outOfStock = product.availableForSale === false;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-400">
            No image
          </div>
        )}

        {product.bucket ? (
          <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-amber-900 shadow-sm backdrop-blur">
            {product.bucket}
          </span>
        ) : null}

        {outOfStock ? (
          <span className="absolute top-3 right-3 rounded-full bg-stone-900/90 px-2.5 py-1 text-xs font-semibold text-white">
            Sold out
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {(product.subcategory || product.productType) && (
          <p className="text-xs font-medium tracking-wide text-stone-500 uppercase">
            {[product.subcategory, product.productType]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}

        <h3 className="line-clamp-2 font-semibold text-stone-900">
          {product.title || product.handle}
        </h3>

        {product.description ? (
          <p className="line-clamp-2 text-sm text-stone-500">
            {product.description}
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-baseline gap-2 pt-2">
          <span className="text-lg font-bold text-stone-900">
            {formatPriceRange(prices.min, prices.max, currency)}
          </span>
          {isRange ? (
            <span className="text-xs text-stone-400">range</span>
          ) : null}
          {hasCompareAt ? (
            <span className="text-sm text-stone-400 line-through">
              {formatPrice(prices.compareAtMin, currency)}
            </span>
          ) : null}
        </div>

        <p className="truncate text-xs text-stone-400">{product.handle}</p>
      </div>
    </article>
  );
}
