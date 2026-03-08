import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/analytics';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['analytics', 'dashboard-stats'],
    queryFn: analyticsApi.getDashboardStats,
    staleTime: 60 * 1000, // 1 minute
    retry: 1,
  });
}

export function useMyPendingActions() {
  return useQuery({
    queryKey: ['analytics', 'my-pending-actions'],
    queryFn: analyticsApi.getMyPendingActions,
    staleTime: 30 * 1000,
    retry: 1,
  });
}

export function useMarketTrends(district?: string, months = 6) {
  return useQuery({
    queryKey: ['analytics', 'market-trends', district, months],
    queryFn: () => analyticsApi.getMarketTrends(district, months),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
