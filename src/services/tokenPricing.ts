import type { CodexLocalAccessUsageStats } from '../types/codexLocalAccess';

export const TOKEN_PRICE_PER_MILLION = {
  input: 0.15,
  output: 0.60,
  cached: 0.075,
};

export function estimateUsdCost(stats: CodexLocalAccessUsageStats): number {
  const uncachedInput = stats.inputTokens - stats.cachedTokens;
  const inputCost = (uncachedInput / 1_000_000) * TOKEN_PRICE_PER_MILLION.input;
  const cachedCost = (stats.cachedTokens / 1_000_000) * TOKEN_PRICE_PER_MILLION.cached;
  const outputCost = (stats.outputTokens / 1_000_000) * TOKEN_PRICE_PER_MILLION.output;
  return inputCost + cachedCost + outputCost;
}
