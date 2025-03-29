import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Transaction } from "@/lib/supabase";
import { PieChartIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/formatters";

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface CategoryAnalysisChartProps {
  transactions: Transaction[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#d0ed57",
];

const CategoryAnalysisChart = ({ transactions }: CategoryAnalysisChartProps) => {
  const categoryData: CategoryData[] = useMemo(() => {
    if (!transactions) return [];

    const categoryMap = new Map<string, number>();

    transactions
      .filter((t) => t.amount < 0)
      .forEach((transaction) => {
        const category = transaction.category;
        const currentValue = categoryMap.get(category) || 0;
        categoryMap.set(category, currentValue + Math.abs(transaction.amount));
      });

    const data = Array.from(categoryMap.entries())
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);

    return data;
  }, [transactions]);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN) * 1.07;
    const y = cy + radius * Math.sin(-midAngle * RADIAN) * 1.07;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-effect p-3 rounded-lg border shadow-sm">
          <p className="font-medium text-sm">{payload[0].name}</p>
          <p className="text-xs mt-1">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="flex items-center">
            <PieChartIcon className="h-5 w-5 mr-2 text-primary" />
            Spending Categories
          </CardTitle>
        </div>
        <CardDescription>
          Distribution of expenses across different categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full flex items-center justify-center">
          {!transactions ? (
            <Skeleton className="h-full w-full" />
          ) : categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      name={entry.name}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{
                    paddingLeft: 20,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No expense data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryAnalysisChart;
