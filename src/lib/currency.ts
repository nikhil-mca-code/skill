const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatCurrencyInr(amount: number | null | undefined) {
  return inrFormatter.format(amount ?? 0);
}
