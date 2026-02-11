const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  GHS: '₵',
  NGN: '₦',
}

export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  options?: { showSign?: boolean; sign?: 'plus' | 'minus' }
): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency + ' '
  const formatted = `${symbol}${Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
  if (options?.showSign && options?.sign === 'plus') return `+${formatted}`
  if (options?.showSign && options?.sign === 'minus') return `−${formatted}`
  return formatted
}
