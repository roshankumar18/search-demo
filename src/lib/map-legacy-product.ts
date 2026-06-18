import type { CatalogSearchProduct } from "../types/catalog-search";

function readAmount(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function readPriceField(
  product: Record<string, unknown>,
  path: string[]
): number | undefined {
  let current: unknown = product;
  for (const key of path) {
    if (!current || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return readAmount(current);
}

function readNestedString(
  product: Record<string, unknown>,
  path: string[]
): string | undefined {
  let current: unknown = product;
  for (const key of path) {
    if (!current || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : undefined;
}

function readCurrency(product: Record<string, unknown>): string | undefined {
  return (
    readNestedString(product, [
      "priceRange",
      "minVariantPrice",
      "currencyCode",
    ]) ??
    (typeof product.currency === "string" ? product.currency : undefined)
  );
}

export function mapLegacyProducts(
  products: Record<string, unknown>[]
): CatalogSearchProduct[] {
  return products.map((product) => {
    const featuredImage = product.featuredImage as { url?: string } | undefined;
    const handle = String(product.handle ?? product.id ?? "");

    return {
      handle,
      title: String(product.title ?? ""),
      subcategory: product.subcategory as string | undefined,
      productType: product.productType as string | undefined,
      description: product.description as string | undefined,
      image:
        featuredImage?.url ??
        (product.image as string | undefined) ??
        (product["featuredImage.url"] as string | undefined),
      prices: {
        min:
          readPriceField(product, ["priceMin"]) ??
          readPriceField(product, ["priceRange", "minVariantPrice", "amount"]),
        max:
          readPriceField(product, ["priceMax"]) ??
          readPriceField(product, ["priceRange", "maxVariantPrice", "amount"]),
        compareAtMin:
          readPriceField(product, ["compareAtPriceMin"]) ??
          readPriceField(product, [
            "compareAtPriceRange",
            "minVariantPrice",
            "amount",
          ]),
        currency: readCurrency(product),
      },
      availableForSale: product.availableForSale as boolean | undefined,
    };
  });
}
