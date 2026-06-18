export function formatPrice(
  amount: number | undefined,
  currency = "INR"
): string {
  if (amount == null || Number.isNaN(amount)) {
    return "";
  }

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-IN")}`;
  }
}

export function formatPriceRange(
  min: number | undefined,
  max: number | undefined,
  currency?: string
): string {
  const resolvedCurrency = currency ?? "INR";
  if (min == null && max == null) {
    return "Price unavailable";
  }
  if (min != null && max != null && min !== max) {
    return `${formatPrice(min, resolvedCurrency)} – ${formatPrice(max, resolvedCurrency)}`;
  }
  return formatPrice(min ?? max, resolvedCurrency);
}
