
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChartIcon } from "lucide-react";

interface TransactionTypeChartProps {
  data: Array<{
    type: string;
    count: number;
  }>;
  isLoading: boolean;
}

export const TransactionTypeChart: React.FC<TransactionTypeChartProps> = ({ data, isLoading }) => {
  // Colors for the pie chart slices
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

  // Format the data for the pie chart
  const chartData = data.map((item, index) => ({
    name: item.type,
    value: item.count,
    color: COLORS[index % COLORS.length]
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background rounded-lg border shadow-md p-2">
          <p className="text-xs font-semibold">{`${payload[0].name}`}</p>
          <p className="text-xs text-muted-foreground">{`${payload[0].value} transactions`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PieChartIcon className="h-5 w-5 mr-2 text-primary" />
          Transaction Types
        </CardTitle>
        <CardDescription>Breakdown of transactions by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No transaction data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
