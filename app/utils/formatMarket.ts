export function formatPrice(price: number) {
  return `${(price * 100).toFixed(0)}¢`
}

export function formatLiquidity(amount: number) {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${amount}`
}
