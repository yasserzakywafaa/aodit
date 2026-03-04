/**
 * Convert currency symbol or lowercase code to ISO 4217 currency code
 * @param currency - Currency symbol (€, $, ₣) or lowercase code (eur, usd, chf)
 * @returns ISO 4217 currency code (EUR, USD, CHF)
 */
export const getCurrencyCode = (currency: string | undefined): string => {
  if (!currency) return "USD";

  const normalized = currency.toLowerCase().trim();

  // Handle currency symbols
  if (normalized === "€" || normalized === "eur") return "EUR";
  if (normalized === "$" || normalized === "usd") return "USD";
  if (normalized === "₣" || normalized === "chf") return "CHF";

  // If already uppercase ISO code, return as is
  if (currency.length === 3 && currency === currency.toUpperCase()) {
    return currency;
  }

  // Default fallback
  return "USD";
};
