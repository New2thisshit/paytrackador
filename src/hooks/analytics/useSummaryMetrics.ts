
import { useMemo } from 'react';
import { Transaction } from '@/lib/supabase';
import { parseISO, isWithinInterval, subDays } from 'date-fns';

export type SummaryMetrics = {
  totalOutgoing: number;
  totalOutgoingPrev: number;
  outgoingChange: number;
  averageTransactionSize: number;
  transactionsByType: { type: string; count: number }[];
  paymentVelocity: number; // rate of spending per day
  transactionCount: number;
};

export const useSummaryMetrics = (
  transactions: Transaction[] | undefined,
  currentPeriodStart: Date,
  currentPeriodEnd: Date
): SummaryMetrics => {
  return useMemo(() => {
    if (!transactions?.length) {
      return {
        totalOutgoing: 0,
        totalOutgoingPrev: 0,
        outgoingChange: 0,
        averageTransactionSize: 0,
        transactionsByType: [],
        paymentVelocity: 0,
        transactionCount: 0
      };
    }

    // Current period transactions
    const currentPeriodTxs = transactions.filter((tx) => {
      const txDate = parseISO(tx.date);
      return isWithinInterval(txDate, { 
        start: currentPeriodStart, 
        end: currentPeriodEnd 
      });
    });

    // Calculate previous period of same length
    const periodLength = currentPeriodEnd.getTime() - currentPeriodStart.getTime();
    const previousPeriodEnd = new Date(currentPeriodStart.getTime() - 1);
    const previousPeriodStart = new Date(previousPeriodEnd.getTime() - periodLength);

    // Previous period transactions
    const previousPeriodTxs = transactions.filter((tx) => {
      const txDate = parseISO(tx.date);
      return isWithinInterval(txDate, { 
        start: previousPeriodStart, 
        end: previousPeriodEnd 
      });
    });

    // Calculate outgoing totals (negative amounts represent expenses)
    const totalOutgoing = currentPeriodTxs
      .filter((tx) => tx.amount < 0)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      
    const totalOutgoingPrev = previousPeriodTxs
      .filter((tx) => tx.amount < 0)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    // Calculate percentage change
    const outgoingChange = totalOutgoingPrev === 0
      ? 100
      : ((totalOutgoing - totalOutgoingPrev) / totalOutgoingPrev) * 100;

    // Average transaction size (for expenses only)
    const expenseTxs = currentPeriodTxs.filter((tx) => tx.amount < 0);
    const averageTransactionSize = expenseTxs.length > 0
      ? expenseTxs.reduce((sum, tx) => sum + Math.abs(tx.amount), 0) / expenseTxs.length
      : 0;

    // Count transactions by category (use category as type)
    const typeMap = new Map<string, number>();
    currentPeriodTxs.forEach((tx) => {
      if (tx.amount < 0) {
        const type = tx.category;
        typeMap.set(type, (typeMap.get(type) || 0) + 1);
      }
    });
    
    const transactionsByType = Array.from(typeMap.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    // Payment velocity (average daily spending)
    const daysDiff = Math.ceil((currentPeriodEnd.getTime() - currentPeriodStart.getTime()) / (1000 * 60 * 60 * 24));
    const paymentVelocity = totalOutgoing / (daysDiff || 1); // avoid division by zero

    return {
      totalOutgoing,
      totalOutgoingPrev,
      outgoingChange,
      averageTransactionSize,
      transactionsByType,
      paymentVelocity,
      transactionCount: expenseTxs.length
    };
  }, [transactions, currentPeriodStart, currentPeriodEnd]);
};
