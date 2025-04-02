
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAnalytics, AnalyticsPeriod } from "@/hooks/analytics/useAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useDateRange } from "@/hooks/useDateRange";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";

import CashFlowAnalysis from "@/components/dashboard/CashFlowAnalysis";
import { TransactionTypeChart } from "@/components/dashboard/overview/TransactionTypeChart";
import { ExpenseBreakdownChart } from "@/components/dashboard/analytics/ExpenseBreakdownChart";
import { AnalyticsSummaryCard } from "@/components/dashboard/analytics/AnalyticsSummaryCard";
import { useSummaryMetrics } from "@/hooks/analytics/useSummaryMetrics";

const Analytics = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState<AnalyticsPeriod>("monthly");
  
  const {
    selectedOption,
    setSelectedOption,
    currentDateRange,
    setCustomDateRange,
    filterTransactionsByDateRange
  } = useDateRange();

  // Get transaction data
  const { transactions, isLoading: transactionsLoading } = useTransactions(user?.id);
  
  // Filter transactions by date range
  const filteredTransactions = filterTransactionsByDateRange(transactions || []);

  // Analytics data
  const {
    summary,
    monthlyData,
    weeklyData,
    categoryData,
    isLoading,
    error
  } = useAnalytics(user?.id);
  
  // Get summary metrics for the current period
  const summaryMetrics = useSummaryMetrics(
    transactions,
    currentDateRange.startDate,
    currentDateRange.endDate
  );

  // Handle date range change from the date picker component
  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    if (range.from && range.to) {
      setCustomDateRange(range.from, range.to);
    }
  };

  // Data for the selected period
  const chartData = period === "monthly" ? monthlyData : weeklyData;
  
  const isPageLoading = isLoading || transactionsLoading;

  // Format functions for the summary cards
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

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Financial Analysis</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <DateRangePicker
            dateRange={{
              from: currentDateRange.startDate,
              to: currentDateRange.endDate
            }}
            onDateRangeChange={handleDateRangeChange}
            onOptionChange={setSelectedOption}
            selectedOption={selectedOption}
          />
          
          <Tabs value={period} onValueChange={(value) => setPeriod(value as AnalyticsPeriod)}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {isPageLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <p className="text-destructive">Error loading analytics data</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AnalyticsSummaryCard 
              title="Total Outgoing"
              value={summaryMetrics.totalOutgoing}
              change={summaryMetrics.outgoingChange}
              changeLabel={summaryMetrics.outgoingChange <= 0 ? "decrease" : "increase"}
              icon="expense"
              formatCurrency={formatCurrency}
              formatPercentage={formatPercentage}
              isLoading={isPageLoading}
              changeDirection="inverted"
            />
            <AnalyticsSummaryCard 
              title="Transaction Count"
              value={summaryMetrics.transactionCount}
              change={0}
              icon="net"
              formatCurrency={(value) => value.toString()}
              formatPercentage={formatPercentage}
              isLoading={isPageLoading}
              decimals={0}
            />
            <AnalyticsSummaryCard 
              title="Avg Payment Size"
              value={summaryMetrics.averageTransactionSize}
              change={0}
              icon="income"
              formatCurrency={formatCurrency}
              formatPercentage={formatPercentage}
              isLoading={isPageLoading}
            />
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cash Flow Chart */}
            <CashFlowAnalysis 
              transactions={filteredTransactions} 
              dateRange={currentDateRange} 
            />
            
            {/* Category Analysis Chart */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-primary" />
                  Expense Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExpenseBreakdownChart data={categoryData} isLoading={isLoading} />
              </CardContent>
            </Card>
          </div>
          
          {/* Transaction Types */}
          <TransactionTypeChart 
            data={summaryMetrics.transactionsByType} 
            isLoading={isLoading} 
          />
        </>
      )}
    </div>
  );
};

export default Analytics;
