
import { AnalyticsSummary, useAnalyticsSummary } from './useAnalyticsSummary';
import { ChartDataItem, useMonthlyChartData, useWeeklyChartData } from './useChartData';
import { CategoryDataItem, useCategoryData } from './useCategoryData';
import { useTransactions } from '../useTransactions';

export type AnalyticsPeriod = 'weekly' | 'monthly';

export type AnalyticsData = {
  summary: AnalyticsSummary;
  monthlyData: ChartDataItem[];
  weeklyData: ChartDataItem[];
  categoryData: CategoryDataItem[];
  isLoading: boolean;
  error: Error | null;
};

export { AnalyticsSummary, ChartDataItem, CategoryDataItem };

export const useAnalytics = (userId: string | undefined): AnalyticsData => {
  const { transactions, isLoading, error } = useTransactions(userId);
  
  const summary = useAnalyticsSummary(transactions);
  const monthlyData = useMonthlyChartData(transactions);
  const weeklyData = useWeeklyChartData(transactions);
  const categoryData = useCategoryData(transactions);

  return {
    summary,
    monthlyData,
    weeklyData,
    categoryData,
    isLoading,
    error
  };
};
