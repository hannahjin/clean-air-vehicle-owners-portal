export function formatNumber(value: number | bigint, options: Intl.NumberFormatOptions = {}) {
  return Intl.NumberFormat(window.navigator.language ?? "en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    ...options,
  }).format(value);
}
