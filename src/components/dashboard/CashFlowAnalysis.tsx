
import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { 
  ChartContainer, 
  ChartLegend, 
  ChartLegendContent, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { 
  CalendarIcon, 
  TrendingUpIcon,
  TrendingDownIcon,
  CircleDollarSignIcon
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { DateRange } from "@/hooks/useDateRange";
import { addDays, differenceInDays, format, parseISO, startOfDay } from "date-fns";

interface CashFlowAnalysisProps {
  transactions: Transaction[];
  dateRange: DateRange;
}

const CashFlowAnalysis = ({ transactions, dateRange }: CashFlowAnalysisProps) => {
  // Generate cash flow forecast
  const cashFlowData = useMemo(() => {
    if (!transactions.length) return [];
    
    // Sort transactions by date
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Calculate number of days to forecast
    const startDate = startOfDay(dateRange.startDate);
    const endDate = startOfDay(dateRange.endDate);
    const daysInRange = Math.max(differenceInDays(endDate, startDate), 1);
    
    // Create a datapoint for each day
    let currentBalance = 0;
    const cashFlowByDay = [];
    
    // Calculate initial balance from past transactions
    const pastTransactions = sortedTransactions.filter(
      t => new Date(t.date) < startDate
    );
    currentBalance = pastTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Generate data for each day in range
    for (let i = 0; i <= daysInRange; i++) {
      const currentDate = addDays(startDate, i);
      const formattedDate = format(currentDate, 'MMM dd');
      
      // Find transactions for this day
      const dayTransactions = sortedTransactions.filter(t => {
        const transactionDate = startOfDay(new Date(t.date));
        return transactionDate.getTime() === currentDate.getTime();
      });
      
      // Calculate inflow and outflow for the day
      const inflow = dayTransactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
        
      const outflow = dayTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      // Update balance
      const dayTotal = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
      currentBalance += dayTotal;
      
      cashFlowByDay.push({
        date: formattedDate,
        balance: Number(currentBalance.toFixed(2)),
        inflow: Number(inflow.toFixed(2)),
        outflow: Number(outflow.toFixed(2))
      });
    }
    
    // Add forecasted days (up to 7 additional days)
    const forecastDays = 7;
    
    // Calculate average daily change
    const totalChange = cashFlowByDay.length >= 2 
      ? cashFlowByDay[cashFlowByDay.length - 1].balance - cashFlowByDay[0].balance 
      : 0;
    const averageDailyChange = cashFlowByDay.length >= 2 
      ? totalChange / cashFlowByDay.length 
      : 0;
    
    let lastBalance = cashFlowByDay.length 
      ? cashFlowByDay[cashFlowByDay.length - 1].balance 
      : 0;
    
    // Add forecasted days
    for (let i = 1; i <= forecastDays; i++) {
      const forecastDate = addDays(endDate, i);
      const formattedDate = format(forecastDate, 'MMM dd');
      lastBalance += averageDailyChange;
      
      cashFlowByDay.push({
        date: formattedDate,
        balance: Number(lastBalance.toFixed(2)),
        inflow: null,
        outflow: null,
        isForecast: true
      });
    }
    
    return cashFlowByDay;
  }, [transactions, dateRange]);
  
  // Determine overall cash flow trend
  const cashFlowTrend = useMemo(() => {
    if (cashFlowData.length < 2) return "neutral";
    
    const startBalance = cashFlowData[0].balance;
    const endBalance = cashFlowData[Math.floor(cashFlowData.length * 0.75)].balance;
    const difference = endBalance - startBalance;
    
    if (difference > 0) return "positive";
    if (difference < 0) return "negative";
    return "neutral";
  }, [cashFlowData]);
  
  // Chart configs for cash flow
  const chartConfig = {
    balance: {
      label: "Balance",
      theme: {
        light: "#0284c7",
        dark: "#38bdf8"
      }
    },
    inflow: {
      label: "Income",
      theme: {
        light: "#16a34a",
        dark: "#4ade80"
      }
    },
    outflow: {
      label: "Expense",
      theme: {
        light: "#dc2626",
        dark: "#f87171"
      }
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CircleDollarSignIcon className="h-5 w-5 mr-2 text-primary" />
            <CardTitle>Cash Flow Forecast</CardTitle>
          </div>
          <Badge 
            className={
              cashFlowTrend === "positive" 
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-200 dark:border-green-800" 
                : cashFlowTrend === "negative"
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border-red-200 dark:border-red-800"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
            }
          >
            {cashFlowTrend === "positive" && (
              <>
                <TrendingUpIcon className="h-3 w-3 mr-1" />
                Upward Trend
              </>
            )}
            {cashFlowTrend === "negative" && (
              <>
                <TrendingDownIcon className="h-3 w-3 mr-1" />
                Downward Trend
              </>
            )}
            {cashFlowTrend === "neutral" && (
              <>
                <CalendarIcon className="h-3 w-3 mr-1" />
                Stable
              </>
            )}
          </Badge>
        </div>
        <CardDescription>
          Account balance projection based on transaction history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mt-4">
          <ChartContainer 
            config={chartConfig}
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={cashFlowData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.1} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tickFormatter={(value) => `$${Math.abs(value) >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={50}
                />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <ChartTooltipContent
                          className="bg-card border border-border"
                        >
                          <div className="px-2 py-1">
                            <p className="text-sm font-medium">{label}</p>
                            <p className="text-sm font-mono">
                              Balance: {formatCurrency(data.balance)}
                            </p>
                            {data.inflow !== null && (
                              <p className="text-sm font-mono text-finance-income">
                                Inflow: +{formatCurrency(data.inflow)}
                              </p>
                            )}
                            {data.outflow !== null && (
                              <p className="text-sm font-mono text-finance-expense">
                                Outflow: -{formatCurrency(data.outflow)}
                              </p>
                            )}
                            {data.isForecast && (
                              <p className="text-xs text-muted-foreground mt-1 italic">Forecasted</p>
                            )}
                          </div>
                        </ChartTooltipContent>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#0284c7" 
                  strokeWidth={2}
                  fill="url(#colorBalance)" 
                  dot={{ r: 1 }}
                  activeDot={{ r: 4, strokeWidth: 1 }}
                />
              </AreaChart>
            </ResponsiveContainer>
            <ChartLegend>
              <ChartLegendContent className="mt-3" />
            </ChartLegend>
          </ChartContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="rounded-lg bg-green-50 dark:bg-green-950 p-3 border border-green-100 dark:border-green-900">
            <p className="text-xs text-green-700 dark:text-green-300 font-medium">Next 7 Days - Incoming</p>
            <p className="text-lg font-mono font-semibold text-green-700 dark:text-green-300 mt-1">
              {formatCurrency(
                transactions
                  .filter(t => t.amount > 0 && new Date(t.date) > new Date() && new Date(t.date) < addDays(new Date(), 7))
                  .reduce((sum, t) => sum + t.amount, 0)
              )}
            </p>
          </div>
          
          <div className="rounded-lg bg-red-50 dark:bg-red-950 p-3 border border-red-100 dark:border-red-900">
            <p className="text-xs text-red-700 dark:text-red-300 font-medium">Next 7 Days - Outgoing</p>
            <p className="text-lg font-mono font-semibold text-red-700 dark:text-red-300 mt-1">
              {formatCurrency(
                Math.abs(
                  transactions
                    .filter(t => t.amount < 0 && new Date(t.date) > new Date() && new Date(t.date) < addDays(new Date(), 7))
                    .reduce((sum, t) => sum + t.amount, 0)
                )
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CashFlowAnalysis;
