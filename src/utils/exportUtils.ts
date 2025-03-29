
import { format } from 'date-fns';
import { Transaction } from '@/lib/supabase';

export const exportToCSV = (
  data: Transaction[], 
  fileName: string = 'export', 
  dateRange?: { startDate: Date, endDate: Date }
) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Add date range to filename if provided
  if (dateRange) {
    const startDateFormatted = format(dateRange.startDate, 'yyyy-MM-dd');
    const endDateFormatted = format(dateRange.endDate, 'yyyy-MM-dd');
    fileName = `${fileName}_${startDateFormatted}_to_${endDateFormatted}`;
  }

  // Define CSV headers
  const headers = ['Date', 'Description', 'Category', 'Amount', 'Status'];

  // Convert data to CSV format
  const csvContent = [
    headers.join(','),
    ...data.map(item => {
      const formattedDate = format(new Date(item.date), 'yyyy-MM-dd');
      const formattedAmount = item.amount.toFixed(2);
      // Escape commas in description and category
      const escapedDesc = `"${item.description.replace(/"/g, '""')}"`;
      const escapedCategory = `"${item.category.replace(/"/g, '""')}"`;
      
      return [
        formattedDate,
        escapedDesc,
        escapedCategory,
        formattedAmount,
        item.status
      ].join(',');
    })
  ].join('\n');

  // Create a Blob containing the CSV data
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${fileName}.csv`);
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
};

export const generateFinancialReport = (
  transactions: Transaction[],
  dateRange: { startDate: Date, endDate: Date, label: string }
) => {
  // Filter transactions by date range
  const filtered = transactions.filter(transaction => {
    const date = new Date(transaction.date);
    return date >= dateRange.startDate && date <= dateRange.endDate;
  });

  // Calculate summary stats
  const income = filtered
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenses = filtered
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
  const netIncome = income - expenses;

  // Group by category for expenses breakdown
  const expensesByCategory = filtered
    .filter(t => t.amount < 0)
    .reduce((acc, t) => {
      const category = t.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const report = {
    dateRange: dateRange.label,
    summary: {
      income,
      expenses,
      netIncome
    },
    expensesByCategory,
    transactions: filtered
  };

  return report;
};
