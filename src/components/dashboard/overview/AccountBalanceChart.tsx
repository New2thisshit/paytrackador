
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2Icon, DollarSignIcon } from "lucide-react";
import { AreaChart, Area, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { BalanceDataPoint } from "@/hooks/useAccountBalance";
import { format, parseISO } from "date-fns";

interface AccountBalanceChartProps {
  data: BalanceDataPoint[];
  currentBalance: number;
  projectedBalance: number;
  isLoading: boolean;
}

export const AccountBalanceChart: React.FC<AccountBalanceChartProps> = ({
  data,
  currentBalance,
  projectedBalance,
  isLoading
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-md">
          <p className="text-xs font-semibold">{format(parseISO(payload[0].payload.date), 'MMM d, yyyy')}</p>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="font-medium text-foreground">Balance:</span> {formatCurrency(payload[0].payload.balance)}
          </p>
          <div className="flex justify-between gap-4 mt-1">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">In:</span> {formatCurrency(payload[0].payload.inflow)}
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Out:</span> {formatCurrency(payload[0].payload.outflow)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <BarChart2Icon className="h-5 w-5 mr-2 text-primary" />
              Account Balance
            </CardTitle>
            <CardDescription>Balance trend and transaction flow</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">Current Balance</p>
              <p className="text-2xl font-bold">{formatCurrency(currentBalance)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-muted-foreground">Projected</p>
              <p className="text-lg font-semibold">{formatCurrency(projectedBalance)}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(parseISO(date), 'MMM d')}
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
                  dataKey="balance" 
                  stroke="#0A84FF" 
                  strokeWidth={2}
                  fill="url(#colorBalance)" 
                />
                <Bar 
                  dataKey="inflow" 
                  fill="var(--finance-income)" 
                  radius={[4, 4, 0, 0]}
                  barSize={6}
                />
                <Bar 
                  dataKey="outflow" 
                  fill="var(--finance-expense)" 
                  radius={[4, 4, 0, 0]}
                  barSize={6}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No data available for the selected period</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
