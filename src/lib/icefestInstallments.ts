/** CLP has no fractional pesos; Mercado Pago confirms the final rounding. */
export function icefestInstallments(total: number) {
  if (!Number.isFinite(total) || total <= 0) return null;
  return { count: 3, amount: Math.round(total / 3), approximate: total % 3 !== 0 };
}