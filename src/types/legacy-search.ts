export interface LegacySearchResponse {
  result: {
    products: Record<string, unknown>[];
    filters?: Record<string, Record<string, number>>;
    faceStats?: Record<string, unknown>;
  };
  total: number;
  error?: string;
}
