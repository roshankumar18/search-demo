export interface CatalogSearchProduct {
  handle: string;
  title: string;
  subcategory?: string;
  productType?: string;
  description?: string;
  image?: string;
  bucket?: string;
  prices: {
    min?: number;
    max?: number;
    compareAtMin?: number;
    currency?: string;
  };
  availableForSale?: boolean;
}

export interface CatalogSearchMeta {
  conceptId: string | null;
  conceptName: string | null;
  conceptApplied: boolean;
  sector: string | null;
  meiliQuery: string;
  meiliFilter: string;
  userMustFilter: string;
  userMustApplied: string[];
  intelligenceFiltersApplied: string[];
  fallbackTriggered: boolean;
  parallelRetrievalApplied: boolean;
  candidateCounts?: Partial<
    Record<"planned_hybrid" | "raw_hybrid" | "behavior" | "union", number>
  >;
  rerankApplied: boolean;
  buckets?: Record<string, string[]>;
}

export interface CatalogSearchResponse {
  results: CatalogSearchProduct[];
  meta: CatalogSearchMeta;
  estimatedTotalHits?: number;
  error?: string;
}

export interface CatalogSearchRequest {
  query: string;
  limit?: number;
  offset?: number;
  filter?: string;
  sort?: string[];
}
