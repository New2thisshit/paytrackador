import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart2Icon, LineChartIcon, CalendarIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAnalytics, AnalyticsPeriod } from "@/hooks/analytics/useAnalytics";
import { DateRange } from "@/hooks/useDateRange";
import { format, isWithinInterval, parseISO } from "date-fns";
import { useTransactions } from "@/hooks/useTransactions";
import { AnalyticsSummaryCard } from "./analytics/AnalyticsSummaryCard";
import { AnalyticsPeriodTabs } from "./analytics/AnalyticsPeriodTabs";
import { ExpenseBreakdownChart } from "./analytics/ExpenseBreakdownChart";

interface AnalyticsSummaryProps {
  dateRange?: DateRange;
}

const AnalyticsSummary = ({ dateRange }: AnalyticsSummaryProps) => {
  const { user } = useAuth();
  const [period, setPeriod] = useState<AnalyticsPeriod>('monthly');
  const { transactions, isLoading: isLoadingTransactions } = useTransactions(user?.id);
  const { 
    summary: analyticsSummary,
    monthlyData: analyticsMonthlyData,
    weeklyData: analyticsWeeklyData,
    categoryData: analyticsCategoryData,
    isLoading: isLoadingAnalytics,
    error
  } = useAnalytics(user?.id);
  
  const [filteredData, setFilteredData] = useState({
    summary: analyticsSummary,
    monthlyData: analyticsMonthlyData,
    weeklyData: analyticsWeeklyData,
    categoryData: analyticsCategoryData
  });
  
  useEffect(() => {
    if (!transactions || isLoadingTransactions || !dateRange) return;
    
    const filteredTransactions = transactions.filter(transaction => {
      const transactionDate = parseISO(transaction.date);
      return isWithinInterval(transactionDate, { 
        start: dateRange.startDate, 
        end: dateRange.endDate 
      });
    });
    
    const income = filteredTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expenses = filteredTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
    const netIncome = income - expenses;
    
    const categoryMap = new Map<string, number>();
    
    filteredTransactions
      .filter(t => t.amount < 0)
      .forEach(transaction => {
        const category = transaction.category;
        const currentValue = categoryMap.get(category) || 0;
        categoryMap.set(category, currentValue + Math.abs(transaction.amount));
      });
    
    const categoryData = Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);
    
    let monthlyData = [];
    let weeklyData = [];
    
    if (period === 'monthly') {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      const monthlyGrouped = filteredTransactions.reduce((acc, transaction) => {
        const date = parseISO(transaction.date);
        const month = date.getMonth();
        
        if (!acc[month]) {
          acc[month] = { income: 0, expenses: 0 };
        }
        
        if (transaction.amount > 0) {
          acc[month].income += transaction.amount;
        } else {
          acc[month].expenses += Math.abs(transaction.amount);
        }
        
        return acc;
      }, {} as Record<number, { income: number, expenses: number }>);
      
      monthlyData = Object.entries(monthlyGrouped).map(([month, data]) => ({
        name: months[parseInt(month)],
        income: data.income,
        expenses: data.expenses
      }));
    } else {
      const days = eachDayOfInterval({
        start: dateRange.startDate,
        end: dateRange.endDate
      });
      
      const dailyData = days.reduce((acc, day) => {
        const dayString = format(day, 'yyyy-MM-dd');
        acc[dayString] = { income: 0, expenses: 0 };
        return acc;
      }, {} as Record<string, { income: number, expenses: number }>);
      
      filteredTransactions.forEach(transaction => {
        const date = format(parseISO(transaction.date), 'yyyy-MM-dd');
        
        if (!dailyData[date]) return;
        
        if (transaction.amount > 0) {
          dailyData[date].income += transaction.amount;
        } else {
          dailyData[date].expenses += Math.abs(transaction.amount);
        }
      });
      
      const last7Days = Object.entries(dailyData)
        .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
        .slice(-7);
      
      weeklyData = last7Days.map(([date, data]) => ({
        name: format(new Date(date), 'EEE'),
        income: data.income,
        expenses: data.expenses
      }));
    }
    
    setFilteredData({
      summary: {
        totalIncome: income,
        totalExpenses: expenses,
        netIncome,
        incomeChange: 0,
        expensesChange: 0,
        netIncomeChange: 0
      },
      monthlyData,
      weeklyData,
      categoryData
    });
  }, [transactions, isLoadingTransactions, dateRange, period]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };
  
  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  };

  const isLoading = isLoadingTransactions || isLoadingAnalytics;
  
  const displayData = dateRange 
    ? filteredData 
    : {
        summary: analyticsSummary,
        monthlyData: analyticsMonthlyData,
        weeklyData: analyticsWeeklyData,
        categoryData: analyticsCategoryData
      };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <BarChart2Icon className="h-5 w-5 mr-2 text-primary" />
              Financial Overview
            </CardTitle>
            <CardDescription>
              {dateRange ? `Data for ${dateRange.label}` : 'Track your financial performance'}
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="h-8">
              <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
              {dateRange?.label || 'All Time'}
            </Button>
            <Button 
              variant={period === 'monthly' ? "default" : "ghost"} 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setPeriod('monthly')}
            >
              <BarChart2Icon className="h-4 w-4" />
            </Button>
            <Button 
              variant={period === 'weekly' ? "default" : "ghost"} 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setPeriod('weekly')}
            >
              <LineChartIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <AnalyticsSummaryCard
            title="Total Income"
            value={displayData.summary.totalIncome}
            change={displayData.summary.incomeChange}
            icon="income"
            isLoading={isLoading}
            formatCurrency={formatCurrency}
            formatPercentage={formatPercentage}
          />
          
          <AnalyticsSummaryCard
            title="Total Expenses"
            value={displayData.summary.totalExpenses}
            change={displayData.summary.expensesChange}
            icon="expense"
            isLoading={isLoading}
            formatCurrency={formatCurrency}
            formatPercentage={formatPercentage}
          />
          
          <AnalyticsSummaryCard
            title="Net Income"
            value={displayData.summary.netIncome}
            change={displayData.summary.netIncomeChange}
            icon="net"
            isLoading={isLoading}
            formatCurrency={formatCurrency}
            formatPercentage={formatPercentage}
          />
        </div>
        
        <AnalyticsPeriodTabs
          period={period}
          onPeriodChange={setPeriod}
          weeklyData={displayData.weeklyData}
          monthlyData={displayData.monthlyData}
          isLoading={isLoading}
        />
        
        <div className="mt-8">
          <h3 className="text-sm font-medium mb-4">Expense Breakdown</h3>
          <ExpenseBreakdownChart 
            data={displayData.categoryData}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsSummary;
