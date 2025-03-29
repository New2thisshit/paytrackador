
import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { DateRange } from "@/hooks/useDateRange";
import { Transaction } from "@/lib/supabase";
import { ArrowDownIcon, ArrowUpIcon, TrendingUpIcon } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, isWithinInterval, parseISO, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, isSameDay, isSameMonth } from "date-fns";
import { formatCurrency } from "@/utils/formatters";
import { Skeleton } from "@/components/ui/skeleton";

interface CashFlowData {
  date: string;
  inflow: number;
  outflow: number;
  balance: number;
}

interface CashFlowAnalysisProps {
  transactions: Transaction[];
  dateRange: DateRange;
}

// Custom tooltip component for cash flow chart
const CashFlowTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-sm p-3">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center mt-1">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-muted-foreground">{entry.name}: </span>
            <span className="text-xs font-medium ml-1">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CashFlowAnalysis = ({ transactions, dateRange }: CashFlowAnalysisProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [view, setView] = React.useState<"weekly" | "monthly">("weekly");
  
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

  // If we don't have enough data for monthly view, default to weekly
  React.useEffect(() => {
    if (cashFlowData.length <= 2 && view === "monthly") {
      setView("weekly");
    }
  }, [cashFlowData, view]);

  // Determine if we should show both tabs or just weekly
  const shouldShowMonthlyTab = useMemo(() => {
    if (!dateRange) return false;
    
    const { startDate, endDate } = dateRange;
    const monthsDiff = 
      (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
      endDate.getMonth() - startDate.getMonth();
      
    return monthsDiff >= 2;
  }, [dateRange]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <TrendingUpIcon className="h-5 w-5 mr-2 text-primary" />
              Cash Flow Analysis
            </CardTitle>
            <CardDescription>
              Income vs. Expenses over time
            </CardDescription>
          </div>
          
          {shouldShowMonthlyTab && (
            <Tabs value={view} onValueChange={(v) => setView(v as "weekly" | "monthly")}>
              <TabsList>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-finance-income mr-2" />
            <span className="text-xs">Income</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-finance-expense mr-2" />
            <span className="text-xs">Expenses</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-primary mr-2" />
            <span className="text-xs">Net Flow</span>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          {!transactions ? (
            <Skeleton className="h-full w-full" />
          ) : cashFlowData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={cashFlowData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 40,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  height={40}
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis 
                  tickFormatter={(value) => `$${Math.abs(value) >= 1000 ? `${Math.round(value/1000)}k` : value}`}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CashFlowTooltip />} />
                <Bar dataKey="inflow" name="Income" fill="#0A84FF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outflow" name="Expenses" fill="#FF453A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="balance" name="Net" fill="#34C759" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No data available for the selected period</p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Card className="shadow-none border bg-muted/10">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <ArrowDownIcon className="h-4 w-4 text-finance-income mr-2" />
                <span className="text-sm font-medium">Total Income</span>
              </div>
              <p className="text-xl font-bold">
                {formatCurrency(cashFlowData.reduce((sum, data) => sum + data.inflow, 0))}
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-none border bg-muted/10">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <ArrowUpIcon className="h-4 w-4 text-finance-expense mr-2" />
                <span className="text-sm font-medium">Total Expenses</span>
              </div>
              <p className="text-xl font-bold">
                {formatCurrency(cashFlowData.reduce((sum, data) => sum + data.outflow, 0))}
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-none border bg-muted/10">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <TrendingUpIcon className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm font-medium">Net Cash Flow</span>
              </div>
              <p className="text-xl font-bold">
                {formatCurrency(cashFlowData.reduce((sum, data) => sum + data.balance, 0))}
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default CashFlowAnalysis;
