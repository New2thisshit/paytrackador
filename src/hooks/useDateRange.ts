
import { useState, useCallback, useMemo } from 'react';
import { startOfMonth, endOfMonth, subMonths, format, parseISO, isWithinInterval } from 'date-fns';
import { Transaction } from '@/lib/supabase';

export type DateRangeOption = '7days' | '30days' | 'thisMonth' | 'lastMonth' | 'custom';

export type DateRange = {
  startDate: Date;
  endDate: Date;
  label: string;
};

export const useDateRange = () => {
  const [selectedOption, setSelectedOption] = useState<DateRangeOption>('thisMonth');
  const [customRange, setCustomRange] = useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({
    startDate: undefined,
    endDate: undefined,
  });

  const dateRanges = useMemo((): Record<DateRangeOption, DateRange> => {
    const today = new Date();
    const thisMonth = {
      startDate: startOfMonth(today),
      endDate: endOfMonth(today),
      label: format(today, 'MMMM yyyy'),
    };

    const lastMonth = {
      startDate: startOfMonth(subMonths(today, 1)),
      endDate: endOfMonth(subMonths(today, 1)),
      label: format(subMonths(today, 1), 'MMMM yyyy'),
    };

    const last7Days = {
      startDate: subMonths(today, 0, -7),
      endDate: today,
      label: 'Last 7 Days',
    };

    const last30Days = {
      startDate: subMonths(today, 0, -30),
      endDate: today,
      label: 'Last 30 Days',
    };

    return {
      '7days': last7Days,
      '30days': last30Days,
      'thisMonth': thisMonth,
      'lastMonth': lastMonth,
      'custom': {
        startDate: customRange.startDate || today,
        endDate: customRange.endDate || today,
        label: customRange.startDate && customRange.endDate 
          ? `${format(customRange.startDate, 'MMM d')} - ${format(customRange.endDate, 'MMM d, yyyy')}`
          : 'Custom Range',
      },
    };
  }, [customRange]);

  const currentDateRange = useMemo(() => {
    return dateRanges[selectedOption];
  }, [dateRanges, selectedOption]);

  const filterTransactionsByDateRange = useCallback(
    (transactions: Transaction[]) => {
      if (!transactions?.length) return [];
      
      const { startDate, endDate } = currentDateRange;
      
      return transactions.filter((transaction) => {
        const transactionDate = parseISO(transaction.date);
        return isWithinInterval(transactionDate, { start: startDate, end: endDate });
      });
    },
    [currentDateRange]
  );

  const setCustomDateRange = useCallback((start: Date, end: Date) => {
    setCustomRange({ startDate: start, endDate: end });
    setSelectedOption('custom');
  }, []);

  return {
    selectedOption,
    setSelectedOption,
    currentDateRange,
    dateRanges,
    filterTransactionsByDateRange,
    setCustomDateRange,
  };
};
