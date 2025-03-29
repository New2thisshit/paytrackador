import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon, ArrowUpIcon, DollarSignIcon, TrendingDownIcon, TrendingUpIcon, BarChart2Icon, LineChartIcon, CalendarIcon } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useAnalytics, AnalyticsPeriod } from "@/hooks/useAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import { DateRange } from "@/hooks/useDateRange";
import { format, subDays, isWithinInterval, parseISO, eachDayOfInterval } from "date-fns";
import { Transaction } from "@/lib/supabase";
import { useTransactions } from "@/hooks/useTransactions";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-effect p-3 rounded-lg border shadow-sm">
        <p className="font-medium text-sm">{label}</p>
        <div className="mt-2 space-y-1">
          <p className="text-xs flex items-center">
            <span className="w-3 h-3 rounded-full bg-finance-income mr-2" />
            Income: {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
            }).format(payload[0].value)}
          </p>
          <p className="text-xs flex items-center">
            <span className="w-3 h-3 rounded-full bg-finance-expense mr-2" />
            Expenses: {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
            }).format(payload[1].value)}
          </p>
        </div>
      </div>
    );
  }

  return null;
};

const CategoryTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-effect p-3 rounded-lg border shadow-sm">
        <p className="font-medium text-sm">{payload[0].payload.name}</p>
        <p className="text-xs mt-1">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
          }).format(payload[0].value)}
        </p>
      </div>
    );
  }

  return null;
};

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
          <Card className="bg-muted/10 border shadow-none">
            <CardContent className="p-4">
              {isLoading ? (
                <Skeleton className="h-24 w-full" />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="rounded-full p-2 bg-finance-income/10">
                      <ArrowDownIcon className="h-4 w-4 text-finance-income" />
                    </div>
                    <div className={cn(
                      "text-xs font-medium flex items-center",
                      displayData.summary.incomeChange >= 0 ? "text-finance-income" : "text-finance-expense"
                    )}>
                      {displayData.summary.incomeChange >= 0 ? (
                        <TrendingUpIcon className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <TrendingDownIcon className="h-3.5 w-3.5 mr-1" />
                      )}
                      {formatPercentage(Math.abs(displayData.summary.incomeChange))}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Income</h3>
                    <p className="text-2xl font-bold mt-1">{formatCurrency(displayData.summary.totalIncome)}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-muted/10 border shadow-none">
            <CardContent className="p-4">
              {isLoading ? (
                <Skeleton className="h-24 w-full" />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="rounded-full p-2 bg-finance-expense/10">
                      <ArrowUpIcon className="h-4 w-4 text-finance-expense" />
                    </div>
                    <div className={cn(
                      "text-xs font-medium flex items-center",
                      displayData.summary.expensesChange <= 0 ? "text-finance-income" : "text-finance-expense"
                    )}>
                      {displayData.summary.expensesChange <= 0 ? (
                        <TrendingDownIcon className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <TrendingUpIcon className="h-3.5 w-3.5 mr-1" />
                      )}
                      {formatPercentage(Math.abs(displayData.summary.expensesChange))}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Expenses</h3>
                    <p className="text-2xl font-bold mt-1">{formatCurrency(displayData.summary.totalExpenses)}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-muted/10 border shadow-none">
            <CardContent className="p-4">
              {isLoading ? (
                <Skeleton className="h-24 w-full" />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="rounded-full p-2 bg-primary/10">
                      <DollarSignIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div className={cn(
                      "text-xs font-medium flex items-center",
                      displayData.summary.netIncomeChange >= 0 ? "text-finance-income" : "text-finance-expense"
                    )}>
                      {displayData.summary.netIncomeChange >= 0 ? (
                        <TrendingUpIcon className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <TrendingDownIcon className="h-3.5 w-3.5 mr-1" />
                      )}
                      {formatPercentage(Math.abs(displayData.summary.netIncomeChange))}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Net Income</h3>
                    <p className="text-2xl font-bold mt-1">{formatCurrency(displayData.summary.netIncome)}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="monthly" value={period} className="mt-6" onValueChange={(value) => setPeriod(value as AnalyticsPeriod)}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-finance-income mr-2" />
                <span className="text-xs">Income</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-finance-expense mr-2" />
                <span className="text-xs">Expenses</span>
              </div>
            </div>
          </div>
          
          <TabsContent value="monthly" className="mt-0 animate-fade-in">
            <div className="h-[300px] w-full">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : displayData.monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={displayData.monthlyData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF453A" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#FF453A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: "#f5f5f5" }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${value / 1000}k`}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="income" 
                      stroke="#0A84FF" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorIncome)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="#FF453A" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorExpenses)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No data available for the selected period</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="weekly" className="mt-0 animate-fade-in">
            <div className="h-[300px] w-full">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : displayData.weeklyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={displayData.weeklyData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF453A" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#FF453A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: "#f5f5f5" }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${value / 1000}k`}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="income" 
                      stroke="#0A84FF" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorIncome)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="#FF453A" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorExpenses)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No data available for the selected period</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <h3 className="text-sm font-medium mb-4">Expense Breakdown</h3>
          <div className="h-[200px]">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : displayData.categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={displayData.categoryData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" horizontal={true} vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: "#f5f5f5" }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CategoryTooltip />} />
                  <Bar 
                    dataKey="value" 
                    fill="#0A84FF" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No expense data available</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsSummary;
