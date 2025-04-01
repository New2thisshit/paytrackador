
import { useMemo } from 'react';
import { Transaction } from '@/lib/supabase';
import { subMonths, parseISO, isWithinInterval } from 'date-fns';

export type CategoryDataItem = {
  name: string;
  value: number;
};

export const useCategoryData = (transactions: Transaction[] | undefined): CategoryDataItem[] => {
  return useMemo(() => {
    if (!transactions?.length) return [];
    
    const now = new Date();
    const currentPeriodStart = subMonths(now, 9);
    
    // Filter transactions from the current period (last 9 months)
    const currentPeriodTransactions = transactions.filter(transaction => {
      const transactionDate = parseISO(transaction.date);
      return isWithinInterval(transactionDate, { start: currentPeriodStart, end: now });
    });
    
    // Generate category data
    const categoryMap = new Map<string, number>();
    
    currentPeriodTransactions
      .filter(t => t.amount < 0)
      .forEach(transaction => {
        const category = transaction.category;
        const currentValue = categoryMap.get(category) || 0;
        categoryMap.set(category, currentValue + Math.abs(transaction.amount));
      });
    
    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7); // Get top 7 categories
  }, [transactions]);
};
