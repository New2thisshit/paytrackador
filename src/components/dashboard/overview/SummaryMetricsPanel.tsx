
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryMetrics } from "@/hooks/analytics/useSummaryMetrics";
import { ArrowDownIcon, ArrowUpIcon, TrendingDownIcon, TrendingUpIcon, BarChart2Icon, CalendarIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SummaryMetricsPanelProps {
  metrics: SummaryMetrics;
  isLoading: boolean;
}

export const SummaryMetricsPanel: React.FC<SummaryMetricsPanelProps> = ({ metrics, isLoading }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Outgoing */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Outgoing</CardTitle>
          <ArrowUpIcon className="h-4 w-4 text-finance-expense" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-7 w-3/4" />
          ) : (
            <>
              <div className="text-2xl font-bold">{formatCurrency(metrics.totalOutgoing)}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                {metrics.outgoingChange > 0 ? (
                  <>
                    <TrendingUpIcon className="mr-1 h-3 w-3 text-finance-expense" />
                    <span className="text-finance-expense">{formatPercent(metrics.outgoingChange)}</span>
                  </>
                ) : (
                  <>
                    <TrendingDownIcon className="mr-1 h-3 w-3 text-finance-income" />
                    <span className="text-finance-income">{formatPercent(Math.abs(metrics.outgoingChange))}</span>
                  </>
                )}
                <span className="ml-1">from previous period</span>
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Average Transaction Size */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
          <BarChart2Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-7 w-3/4" />
          ) : (
            <>
              <div className="text-2xl font-bold">{formatCurrency(metrics.averageTransactionSize)}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.transactionCount} transactions
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Payment Velocity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Spending</CardTitle>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-7 w-3/4" />
          ) : (
            <>
              <div className="text-2xl font-bold">{formatCurrency(metrics.paymentVelocity)}</div>
              <p className="text-xs text-muted-foreground">
                Average per day
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Transactions by Type */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          <BarChart2Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading || metrics.transactionsByType.length === 0 ? (
            <Skeleton className="h-7 w-3/4" />
          ) : (
            <>
              <div className="text-2xl font-bold">{metrics.transactionsByType[0]?.type}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.transactionsByType[0]?.count} transactions
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
