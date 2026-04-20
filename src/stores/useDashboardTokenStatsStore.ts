import { create } from 'zustand';
import { getCodexLocalAccessState } from '../services/codexLocalAccessService';
import { estimateUsdCost } from '../services/tokenPricing';

interface DashboardTokenStats {
  todayTokens: number;
  todayCostUsd: number;
  weeklyAvgTokens: number;
  weeklyAvgCostUsd: number;
  isLoading: boolean;
  isRunning: boolean;
  fetchStats: () => Promise<void>;
}

export const useDashboardTokenStatsStore = create<DashboardTokenStats>((set) => ({
  todayTokens: 0,
  todayCostUsd: 0,
  weeklyAvgTokens: 0,
  weeklyAvgCostUsd: 0,
  isLoading: false,
  isRunning: false,
  fetchStats: async () => {
    set({ isLoading: true });
    try {
      const state = await getCodexLocalAccessState();
      const { daily, weekly } = state.stats;
      const todayTokens = daily.totals.totalTokens;
      const weeklyAvgTokens = Math.round(weekly.totals.totalTokens / 7);
      set({
        todayTokens,
        todayCostUsd: estimateUsdCost(daily.totals),
        weeklyAvgTokens,
        weeklyAvgCostUsd: estimateUsdCost(weekly.totals) / 7,
        isLoading: false,
        isRunning: state.running,
      });
    } catch {
      set({ isLoading: false, isRunning: false });
    }
  },
}));
