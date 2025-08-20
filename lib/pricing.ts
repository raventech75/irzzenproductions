/** Arrondit à la centaine supérieure */
const roundUp100 = (n: number) => Math.ceil(n / 100) * 100;

/** 
 * Règle métier :
 * - total = formule + options
 * - acompte suggéré = 15% du total, arrondi à la centaine supérieure
 * - l’acompte n’est pas obligatoire => on affiche aussi le "reste à payer le jour J"
 */
export function computePricing(base: number, optionPrices: number[]) {
  const total = base + optionPrices.reduce((a, b) => a + b, 0);
  const depositSuggested = roundUp100(total * 0.15);
  const remainingDayJ = Math.max(total - depositSuggested, 0);
  return { total, depositSuggested, remainingDayJ };
}