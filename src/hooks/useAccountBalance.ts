
import { useMemo } from 'react';
import { Transaction } from '@/lib/supabase';
import { addDays, format, parseISO, isWithinInterval, startOfDay, endOfDay, isBefore, isAfter } from 'date-fns';

export type BalanceDataPoint = {
  date: string;
  balance: number;
  inflow: number;
  outflow: number;
};

export const useAccountBalance = (
  transactions: Transaction[] | undefined, 
  startDate: Date,
  endDate: Date,
  initialBalance = 0
): {
  balanceData: BalanceDataPoint[];
  currentBalance: number;
  projectedBalance: number;
} => {
  return useMemo(() => {
    if (!transactions?.length) {
      return { 
        balanceData: [], 
        currentBalance: initialBalance,
        projectedBalance: initialBalance
      };
    }

    // Sort transactions by date (ascending)
    const sortedTransactions = [...transactions].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    // Create a map of dates to transactions in the period
    const dailyMap = new Map<string, { inflows: number; outflows: number }>();

    // Initialize each day in the range
    let currentDay = startOfDay(startDate);
    const lastDay = endOfDay(endDate);
    
    while (isBefore(currentDay, lastDay) || format(currentDay, 'yyyy-MM-dd') === format(lastDay, 'yyyy-MM-dd')) {
      const dateKey = format(currentDay, 'yyyy-MM-dd');
      dailyMap.set(dateKey, { inflows: 0, outflows: 0 });
      currentDay = addDays(currentDay, 1);
    }

    // Group transactions by date
    sortedTransactions.forEach(transaction => {
      const txDate = parseISO(transaction.date);
      const dateKey = format(txDate, 'yyyy-MM-dd');
      
      if (dailyMap.has(dateKey)) {
        const dayData = dailyMap.get(dateKey)!;
        
        if (transaction.amount > 0) {
          dayData.inflows += transaction.amount;
        } else {
          dayData.outflows += Math.abs(transaction.amount);
        }
        
        dailyMap.set(dateKey, dayData);
      }
    });

    // Generate balance data with running total
    const balanceData: BalanceDataPoint[] = [];
    let runningBalance = initialBalance;
    const today = startOfDay(new Date());
    let todayBalance = initialBalance;
    let finalBalance = initialBalance;

    Array.from(dailyMap.entries()).forEach(([dateStr, { inflows, outflows }]) => {
      const netChange = inflows - outflows;
      runningBalance += netChange;
      
      balanceData.push({
        date: dateStr,
        balance: runningBalance,
        inflow: inflows,
        outflow: outflows
      });
      
      const entryDate = parseISO(dateStr);
      if (isBefore(entryDate, today) || format(entryDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
        todayBalance = runningBalance;
      }
      
      finalBalance = runningBalance;
    });

    return {
      balanceData,
      currentBalance: todayBalance,
      projectedBalance: finalBalance
    };
  }, [transactions, startDate, endDate, initialBalance]);
};
