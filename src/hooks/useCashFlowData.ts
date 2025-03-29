
import { useMemo } from "react";
import { Transaction } from "@/lib/supabase";
import { DateRange } from "@/hooks/useDateRange";
import { format, isWithinInterval, parseISO, endOfWeek, endOfMonth, eachWeekOfInterval, eachMonthOfInterval } from "date-fns";

export interface CashFlowData {
  date: string;
  inflow: number;
  outflow: number;
  balance: number;
}

export type CashFlowViewType = "weekly" | "monthly";

export const useCashFlowData = (
  transactions: Transaction[], 
  dateRange: DateRange,
  view: CashFlowViewType
) => {
  const cashFlowData = useMemo(() => {
    if (!transactions?.length) return [];
    
    const { startDate, endDate } = dateRange;
    
    let intervalData: CashFlowData[] = [];
    let intervals: Date[] = [];
    
    // Create intervals based on view type
    if (view === "weekly") {
      intervals = eachWeekOfInterval(
        { start: startDate, end: endDate },
        { weekStartsOn: 1 }
      );
    } else {
      intervals = eachMonthOfInterval(
        { start: startDate, end: endDate }
      );
    }
    
    // Add the end date to make sure we include the final period
    intervals.push(new Date(endDate));
    
    // Generate data for each interval
    for (let i = 0; i < intervals.length - 1; i++) {
      const periodStart = intervals[i];
      const periodEnd = view === "weekly" 
        ? endOfWeek(intervals[i], { weekStartsOn: 1 })
        : endOfMonth(intervals[i]);
      
      // Don't go past the selected end date
      const effectiveEnd = periodEnd > endDate ? endDate : periodEnd;
      
      // Skip if this period is outside our date range
      if (periodStart > endDate || effectiveEnd < startDate) continue;
      
      // Filter transactions for this period
      const periodTransactions = transactions.filter(t => {
        const txDate = parseISO(t.date);
        return isWithinInterval(txDate, { 
          start: periodStart, 
          end: effectiveEnd 
        });
      });
      
      // Calculate inflow, outflow, and balance
      const inflow = periodTransactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
        
      const outflow = periodTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      const balance = inflow - outflow;
      
      // Format date label based on view
      const dateLabel = view === "weekly"
        ? `${format(periodStart, 'MMM d')}-${format(effectiveEnd, 'MMM d')}`
        : format(periodStart, 'MMM yyyy');
      
      intervalData.push({
        date: dateLabel,
        inflow,
        outflow,
        balance
      });
    }
    
    return intervalData;
  }, [transactions, dateRange, view]);

  // Check if we should show the monthly view option
  const shouldShowMonthlyView = useMemo(() => {
    if (!dateRange) return false;
    
    const { startDate, endDate } = dateRange;
    const monthsDiff = 
      (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
      endDate.getMonth() - startDate.getMonth();
      
    return monthsDiff >= 2;
  }, [dateRange]);

  return { cashFlowData, shouldShowMonthlyView };
};
