
import { useMemo } from 'react';
import { Transaction } from '@/lib/supabase';
import { format, subMonths, parseISO, isWithinInterval } from 'date-fns';

export type ChartDataItem = {
  name: string;
  income: number;
  expenses: number;
};

export const useMonthlyChartData = (transactions: Transaction[] | undefined): ChartDataItem[] => {
  return useMemo(() => {
    if (!transactions?.length) return [];
    
    const now = new Date();
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
    
    return monthlyData;
  }, [transactions]);
};

export const useWeeklyChartData = (transactions: Transaction[] | undefined): ChartDataItem[] => {
  return useMemo(() => {
    if (!transactions?.length) return [];
    
    const now = new Date();
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
    
    return weeklyData;
  }, [transactions]);
};
