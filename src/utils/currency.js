export function roundAmount(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

export function formatCurrency(amount) {
  return `${roundAmount(amount).toFixed(2)} MAD`;
}
