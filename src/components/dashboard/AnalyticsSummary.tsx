
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon, ArrowUpIcon, DollarSignIcon, TrendingDownIcon, TrendingUpIcon, BarChart2Icon, LineChartIcon, CalendarIcon } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useAnalytics, AnalyticsPeriod } from "@/hooks/useAnalytics";
import { Skeleton } from "@/components/ui/skeleton";

// Custom tooltip for the chart
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

const AnalyticsSummary = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState<AnalyticsPeriod>('monthly');
  const { 
    summary,
    monthlyData,
    weeklyData,
    categoryData,
    isLoading,
    error
  } = useAnalytics(user?.id);
  
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
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <BarChart2Icon className="h-5 w-5 mr-2 text-primary" />
              Financial Overview
            </CardTitle>
            <CardDescription>
              Track your financial performance
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="h-8">
              <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
              Last 30 Days
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <LineChartIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <BarChart2Icon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Summary Cards */}
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
                      summary.incomeChange >= 0 ? "text-finance-income" : "text-finance-expense"
                    )}>
                      {summary.incomeChange >= 0 ? (
                        <TrendingUpIcon className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <TrendingDownIcon className="h-3.5 w-3.5 mr-1" />
                      )}
                      {formatPercentage(Math.abs(summary.incomeChange))}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Income</h3>
                    <p className="text-2xl font-bold mt-1">{formatCurrency(summary.totalIncome)}</p>
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
                      summary.expensesChange <= 0 ? "text-finance-income" : "text-finance-expense"
                    )}>
                      {summary.expensesChange <= 0 ? (
                        <TrendingDownIcon className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <TrendingUpIcon className="h-3.5 w-3.5 mr-1" />
                      )}
                      {formatPercentage(Math.abs(summary.expensesChange))}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Expenses</h3>
                    <p className="text-2xl font-bold mt-1">{formatCurrency(summary.totalExpenses)}</p>
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
                      summary.netIncomeChange >= 0 ? "text-finance-income" : "text-finance-expense"
                    )}>
                      {summary.netIncomeChange >= 0 ? (
                        <TrendingUpIcon className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <TrendingDownIcon className="h-3.5 w-3.5 mr-1" />
                      )}
                      {formatPercentage(Math.abs(summary.netIncomeChange))}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Net Income</h3>
                    <p className="text-2xl font-bold mt-1">{formatCurrency(summary.netIncome)}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <Tabs defaultValue="monthly" className="mt-6" onValueChange={(value) => setPeriod(value as AnalyticsPeriod)}>
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
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlyData}
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
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="weekly" className="mt-0 animate-fade-in">
            <div className="h-[300px] w-full">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={weeklyData}
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
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Expense Breakdown */}
        <div className="mt-8">
          <h3 className="text-sm font-medium mb-4">Expense Breakdown</h3>
          <div className="h-[200px]">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
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
