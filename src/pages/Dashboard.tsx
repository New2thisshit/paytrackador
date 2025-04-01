
import React, { useState, useEffect } from "react";
import AnalyticsSummary from "@/components/dashboard/AnalyticsSummary";
import TransactionList from "@/components/dashboard/TransactionList";
import NotificationCenter from "@/components/dashboard/NotificationCenter";
import CategoryAnalysisChart from "@/components/dashboard/CategoryAnalysisChart";
import AnomalyDetection from "@/components/dashboard/AnomalyDetection";
import CashFlowAnalysis from "@/components/dashboard/CashFlowAnalysis";
import VendorAnalysis from "@/components/dashboard/VendorAnalysis";
import { useAuth } from "@/hooks/useAuth";
import { useDateRange } from "@/hooks/useDateRange";
import { useTransactions } from "@/hooks/useTransactions";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardQuickActions from "@/components/dashboard/DashboardQuickActions";
import RecentTransactionsCard from "@/components/dashboard/RecentTransactionsCard";
import { SummaryMetricsPanel } from "@/components/dashboard/overview/SummaryMetricsPanel";
import { AccountBalanceChart } from "@/components/dashboard/overview/AccountBalanceChart";
import { TransactionTypeChart } from "@/components/dashboard/overview/TransactionTypeChart";
import { useSummaryMetrics } from "@/hooks/analytics/useSummaryMetrics";
import { useAccountBalance } from "@/hooks/useAccountBalance";

const Dashboard = () => {
  const { user } = useAuth();
  const { transactions, isLoading } = useTransactions(user?.id);
  const { 
    currentDateRange, 
    selectedOption, 
    setSelectedOption, 
    filterTransactionsByDateRange,
    setCustomDateRange
  } = useDateRange();
  
  const [filteredTransactions, setFilteredTransactions] = useState(transactions || []);
  
  useEffect(() => {
    if (transactions) {
      setFilteredTransactions(filterTransactionsByDateRange(transactions));
    }
  }, [transactions, filterTransactionsByDateRange]);
  
  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setCustomDateRange(range.from, range.to);
  };

  // Get summary metrics for the current date range
  const summaryMetrics = useSummaryMetrics(
    transactions,
    currentDateRange.startDate,
    currentDateRange.endDate
  );

  // Get account balance data
  const { 
    balanceData, 
    currentBalance, 
    projectedBalance 
  } = useAccountBalance(
    transactions,
    currentDateRange.startDate,
    currentDateRange.endDate,
    5000 // starting balance - this could be fetched from an API or set by user
  );

  return (
    <div className="space-y-8">
      <DashboardHeader 
        dateRange={currentDateRange}
        onDateRangeChange={handleDateRangeChange}
        onOptionChange={setSelectedOption}
        selectedOption={selectedOption}
        filteredTransactions={filteredTransactions}
      />
      
      {/* Summary Metrics Panel */}
      <SummaryMetricsPanel 
        metrics={summaryMetrics}
        isLoading={isLoading}
      />
      
      {/* Account Balance Chart */}
      <AccountBalanceChart 
        data={balanceData}
        currentBalance={currentBalance}
        projectedBalance={projectedBalance}
        isLoading={isLoading}
      />
      
      {/* Charts and Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryAnalysisChart transactions={filteredTransactions} />
        <TransactionTypeChart 
          data={summaryMetrics.transactionsByType}
          isLoading={isLoading}
        />
      </div>
      
      {/* Analytics Summary */}
      <AnalyticsSummary dateRange={currentDateRange} />
      
      {/* Vendor Analysis and Anomaly Detection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VendorAnalysis transactions={filteredTransactions} />
        <AnomalyDetection transactions={filteredTransactions} />
      </div>
      
      {/* Cash Flow Analysis */}
      <CashFlowAnalysis transactions={filteredTransactions} dateRange={currentDateRange} />
      
      {/* Quick Actions and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <DashboardQuickActions />
          <NotificationCenter />
        </div>
        
        <div className="lg:col-span-2">
          <RecentTransactionsCard 
            transactions={filteredTransactions}
            isLoading={isLoading}
          />
          
          <TransactionList 
            limit={5} 
            dateRange={currentDateRange} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
