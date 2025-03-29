
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryTooltip } from "./CustomTooltips";

interface CategoryData {
  name: string;
  value: number;
}

interface ExpenseBreakdownChartProps {
  data: CategoryData[];
  isLoading: boolean;
}

export const ExpenseBreakdownChart: React.FC<ExpenseBreakdownChartProps> = ({ data, isLoading }) => {
  return (
    <div className="h-[200px]">
      {isLoading ? (
        <Skeleton className="h-full w-full" />
      ) : data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
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
  );
};
