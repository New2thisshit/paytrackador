
import { useMemo } from 'react';
import { Transaction } from '@/lib/supabase';
import { format, subMonths, parseISO, isWithinInterval } from 'date-fns';

export type AnalyticsSummary = {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  incomeChange: number;
  expensesChange: number;
  netIncomeChange: number;
};

export const useAnalyticsSummary = (transactions: Transaction[] | undefined): AnalyticsSummary => {
  return useMemo(() => {
    if (!transactions?.length) {
      return {
        totalIncome: 0,
        totalExpenses: 0,
        netIncome: 0,
        incomeChange: 0,
        expensesChange: 0,
        netIncomeChange: 0
      };
    }

    const now = new Date();
    
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

    return {
      totalIncome: currentIncome,
      totalExpenses: currentExpenses,
      netIncome: currentNetIncome,
      incomeChange,
      expensesChange,
      netIncomeChange
    };
  }, [transactions]);
};
