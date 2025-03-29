
import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomTooltip } from "./CustomTooltips";

interface ChartData {
  name: string;
  income: number;
  expenses: number;
}

interface AnalyticsChartAreaProps {
  data: ChartData[];
  isLoading: boolean;
}

export const AnalyticsChartArea: React.FC<AnalyticsChartAreaProps> = ({ data, isLoading }) => {
  return (
    <div className="h-[300px] w-full">
      {isLoading ? (
        <Skeleton className="h-full w-full" />
      ) : data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
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
  );
};
