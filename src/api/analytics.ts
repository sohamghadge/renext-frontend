import apiClient from './client';
import type { AnalyticsStats, MarketTrend, ApprovalWorkflowStep } from '../types';

export const analyticsApi = {
  getDashboardStats: async (): Promise<AnalyticsStats> => {
    const { data } = await apiClient.get<AnalyticsStats>('/analytics/dashboard-stats');
    return data;
  },

  getMyPendingActions: async (): Promise<ApprovalWorkflowStep[]> => {
    const { data } = await apiClient.get<ApprovalWorkflowStep[]>('/analytics/my-pending-actions');
    return Array.isArray(data) ? data : [];
  },

  getMarketTrends: async (district?: string, months?: number): Promise<MarketTrend[]> => {
    const { data } = await apiClient.get<MarketTrend[]>('/analytics/market-trends', {
      params: { district, months },
    });
    return Array.isArray(data) ? data : [];
  },
};
