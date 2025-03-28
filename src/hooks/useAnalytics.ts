
import { useMemo } from 'react';
import { Transaction } from '@/lib/supabase';
import { useTransactions } from './useTransactions';
import { format, subMonths, parseISO, isWithinInterval } from 'date-fns';

export type AnalyticsPeriod = 'weekly' | 'monthly';

export type AnalyticsSummary = {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  incomeChange: number;
  expensesChange: number;
  netIncomeChange: number;
};

export type ChartDataItem = {
  name: string;
  income: number;
  expenses: number;
};

export type CategoryDataItem = {
  name: string;
  value: number;
};

export type AnalyticsData = {
  summary: AnalyticsSummary;
  monthlyData: ChartDataItem[];
  weeklyData: ChartDataItem[];
  categoryData: CategoryDataItem[];
  isLoading: boolean;
  error: Error | null;
};

export const useAnalytics = (userId: string | undefined): AnalyticsData => {
  const { transactions, isLoading, error } = useTransactions(userId);
  
  const analyticsData = useMemo(() => {
    if (!transactions?.length) {
      return {
        summary: {
          totalIncome: 0,
          totalExpenses: 0, 
          netIncome: 0,
          incomeChange: 0, 
          expensesChange: 0,
          netIncomeChange: 0
        },
        monthlyData: [],
        weeklyData: [],
        categoryData: []
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Filter transactions from the current period (last 9 months)
    const currentPeriodStart = subMonths(now, 9);
    const currentPeriodTransactions = transactions.filter(transaction => {
      const transactionDate = parseISO(transaction.date);
      return isWithinInterval(transactionDate, { start: currentPeriodStart, end: now });
    });
    
    // Filter transactions from the previous period (9 months before the current period)
    const previousPeriodStart = subMonths(currentPeriodStart, 9);
    const previousPeriodEnd = subMonths(currentPeriodStart, 1);
    const previousPeriodTransactions = transactions.filter(transaction => {
      const transactionDate = parseISO(transaction.date);
      return isWithinInterval(transactionDate, { start: previousPeriodStart, end: previousPeriodEnd });
    });
    
    // Calculate totals for current period
    const currentIncome = currentPeriodTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const currentExpenses = currentPeriodTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const currentNetIncome = currentIncome - currentExpenses;
    
    // Calculate totals for previous period
    const previousIncome = previousPeriodTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const previousExpenses = previousPeriodTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const previousNetIncome = previousIncome - previousExpenses;
    
    // Calculate percent changes
    const incomeChange = previousIncome === 0 
      ? 100 
      : ((currentIncome - previousIncome) / previousIncome) * 100;
    
    const expensesChange = previousExpenses === 0 
      ? 100 
      : ((currentExpenses - previousExpenses) / previousExpenses) * 100;
    
    const netIncomeChange = previousNetIncome === 0 
      ? 100 
      : ((currentNetIncome - previousNetIncome) / previousNetIncome) * 100;
    
    // Generate monthly chart data
    const monthlyData: ChartDataItem[] = [];
    
    for (let i = 8; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthName = format(monthDate, 'MMM');
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
      
      const monthTransactions = transactions.filter(transaction => {
        const transactionDate = parseISO(transaction.date);
        return isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
      });
      
      const monthIncome = monthTransactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
        
      const monthExpenses = monthTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      monthlyData.push({
        name: monthName,
        income: monthIncome,
        expenses: monthExpenses
      });
    }
    
    // Generate weekly chart data
    const weeklyData: ChartDataItem[] = [];
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Filter transactions from the current week
    const lastWeekStart = new Date(now);
    lastWeekStart.setDate(now.getDate() - now.getDay() - 6);
    lastWeekStart.setHours(0, 0, 0, 0);
    
    const lastWeekEnd = new Date(now);
    lastWeekEnd.setDate(now.getDate() - now.getDay());
    lastWeekEnd.setHours(23, 59, 59, 999);
    
    const lastWeekTransactions = transactions.filter(transaction => {
      const transactionDate = parseISO(transaction.date);
      return isWithinInterval(transactionDate, { start: lastWeekStart, end: lastWeekEnd });
    });
    
    for (let i = 0; i < 7; i++) {
      const dayName = daysOfWeek[i];
      const dayTransactions = lastWeekTransactions.filter(transaction => {
        const transactionDate = parseISO(transaction.date);
        return transactionDate.getDay() === (i + 1) % 7; // Monday is 1, Sunday is 0
      });
      
      const dayIncome = dayTransactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
        
      const dayExpenses = dayTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      weeklyData.push({
        name: dayName,
        income: dayIncome,
        expenses: dayExpenses
      });
    }
    
    // Generate category data
    const categoryMap = new Map<string, number>();
    
    currentPeriodTransactions
      .filter(t => t.amount < 0)
      .forEach(transaction => {
        const category = transaction.category;
        const currentValue = categoryMap.get(category) || 0;
        categoryMap.set(category, currentValue + Math.abs(transaction.amount));
      });
    
    const categoryData: CategoryDataItem[] = Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7); // Get top 7 categories
    
    return {
      summary: {
        totalIncome: currentIncome,
        totalExpenses: currentExpenses,
        netIncome: currentNetIncome,
        incomeChange,
        expensesChange,
        netIncomeChange
      },
      monthlyData,
      weeklyData,
      categoryData
    };
  }, [transactions]);

  return {
    ...analyticsData,
    isLoading,
    error
  };
};
