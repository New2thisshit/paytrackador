
import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/lib/supabase";
import { 
  ChartContainer, 
  ChartLegend, 
  ChartLegendContent, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChartPieIcon, LayoutListIcon, ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface CategoryAnalysisChartProps {
  transactions: Transaction[];
}

interface CategoryData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

// Colors for the pie chart
const COLORS = [
  "#0ea5e9", "#6366f1", "#8b5cf6", "#d946ef", "#f43f5e", 
  "#f97316", "#facc15", "#4ade80", "#2dd4bf", "#06b6d4"
];

const CategoryAnalysisChart = ({ transactions }: CategoryAnalysisChartProps) => {
  const [viewType, setViewType] = React.useState<"pie" | "bar">("pie");
  const [categoryType, setCategoryType] = React.useState<"expense" | "income">("expense");
  
  // Calculate category data
  const categoryData = useMemo(() => {
    if (!transactions.length) return [];
    
    // Filter by transaction type (expense or income)
    const filteredTransactions = transactions.filter(t => 
      categoryType === "expense" ? t.amount < 0 : t.amount > 0
    );
    
    // Group by category
    const categories = filteredTransactions.reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += Math.abs(transaction.amount);
      return acc;
    }, {} as Record<string, number>);
    
    // Convert to array and calculate percentages
    const totalAmount = Object.values(categories).reduce((sum, amount) => sum + amount, 0);
    
    const result = Object.entries(categories)
      .map(([name, value], index) => ({
        name,
        value,
        percentage: totalAmount ? (value / totalAmount) * 100 : 0,
        color: COLORS[index % COLORS.length]
      }))
      .sort((a, b) => b.value - a.value);
    
    return result;
  }, [transactions, categoryType]);
  
  // Display top 10 categories, group the rest as "Other"
  const displayData = useMemo(() => {
    if (categoryData.length <= 10) return categoryData;
    
    const topCategories = categoryData.slice(0, 9);
    const otherCategories = categoryData.slice(9);
    
    const otherValue = otherCategories.reduce((sum, cat) => sum + cat.value, 0);
    const otherPercentage = otherCategories.reduce((sum, cat) => sum + cat.percentage, 0);
    
    return [
      ...topCategories,
      {
        name: "Other",
        value: otherValue,
        percentage: otherPercentage,
        color: "#cbd5e1" // Light slate color for "Other"
      }
    ];
  }, [categoryData]);
  
  // Calculate month-over-month changes for bar chart
  const compareData = useMemo(() => {
    if (!transactions.length) return [];
    
    // Group transactions by month
    const monthlyData: Record<string, Record<string, number>> = {};
    
    transactions.filter(t => 
      categoryType === "expense" ? t.amount < 0 : t.amount > 0
    ).forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {};
      }
      
      const category = transaction.category;
      if (!monthlyData[monthKey][category]) {
        monthlyData[monthKey][category] = 0;
      }
      
      monthlyData[monthKey][category] += Math.abs(transaction.amount);
    });
    
    // Sort months and take the last two (current and previous)
    const months = Object.keys(monthlyData).sort();
    if (months.length < 2) return [];
    
    const currentMonth = monthlyData[months[months.length - 1]];
    const previousMonth = monthlyData[months[months.length - 2]];
    
    // Get top 5 categories from current month
    const topCategories = Object.entries(currentMonth)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);
    
    // Create comparison data
    return topCategories.map((category, index) => {
      const currentValue = currentMonth[category] || 0;
      const previousValue = previousMonth?.[category] || 0;
      const change = previousValue ? ((currentValue - previousValue) / previousValue) * 100 : 100;
      
      return {
        name: category,
        current: currentValue,
        previous: previousValue,
        change,
        color: COLORS[index % COLORS.length]
      };
    });
  }, [transactions, categoryType]);
  
  // Render custom label for pie chart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }: any) => {
    if (percent < 0.05) return null; // Don't show labels for small slices
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="#fff"
        dominantBaseline="central"
        textAnchor="middle"
        fontSize={10}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="flex items-center">
              <ChartPieIcon className="h-5 w-5 mr-2 text-primary" />
              Category Analysis
            </CardTitle>
            <CardDescription>
              Breakdown of spending by category
            </CardDescription>
          </div>
          
          <div className="flex space-x-2">
            <ToggleGroup type="single" value={categoryType} onValueChange={(value) => value && setCategoryType(value as "expense" | "income")}>
              <ToggleGroupItem value="expense" aria-label="Show expenses">
                <ArrowDownIcon className="h-4 w-4 mr-1" />
                Expenses
              </ToggleGroupItem>
              <ToggleGroupItem value="income" aria-label="Show income">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                Income
              </ToggleGroupItem>
            </ToggleGroup>
            
            <ToggleGroup type="single" value={viewType} onValueChange={(value) => value && setViewType(value as "pie" | "bar")}>
              <ToggleGroupItem value="pie" aria-label="Show pie chart">
                <ChartPieIcon className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="bar" aria-label="Show comparison">
                <LayoutListIcon className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {displayData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No {categoryType} data available</p>
          </div>
        ) : (
          <div className="h-[350px]">
            {viewType === "pie" ? (
              <ChartContainer className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={displayData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={125}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {displayData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload as CategoryData;
                          return (
                            <ChartTooltipContent className="bg-card border border-border">
                              <div className="px-2 py-1">
                                <p className="text-sm font-medium">{data.name}</p>
                                <p className="text-sm font-mono">{formatCurrency(data.value)}</p>
                                <p className="text-xs text-muted-foreground">
                                  {data.percentage.toFixed(1)}% of total
                                </p>
                              </div>
                            </ChartTooltipContent>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <ChartContainer className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={compareData}
                    layout="vertical"
                    margin={{ top: 10, right: 10, left: 50, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.1} horizontal={false} />
                    <XAxis 
                      type="number"
                      tickFormatter={(value) => `$${Math.abs(value) >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      tick={{ fontSize: 12 }}
                      width={80}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          const changeText = data.change > 0 
                            ? `↑ ${data.change.toFixed(1)}%` 
                            : data.change < 0 
                            ? `↓ ${Math.abs(data.change).toFixed(1)}%` 
                            : `${data.change.toFixed(1)}%`;
                            
                          const changeClass = data.change > 0 
                            ? "text-finance-income" 
                            : data.change < 0 
                            ? "text-finance-expense" 
                            : "";
                            
                          return (
                            <div className="bg-card rounded-lg border border-border shadow-md p-2 text-sm">
                              <p className="font-medium mb-1">{label}</p>
                              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                                <p className="text-muted-foreground">Current:</p>
                                <p className="font-mono">{formatCurrency(data.current)}</p>
                                
                                <p className="text-muted-foreground">Previous:</p>
                                <p className="font-mono">{formatCurrency(data.previous)}</p>
                                
                                <p className="text-muted-foreground">Change:</p>
                                <p className={`font-mono ${changeClass}`}>{changeText}</p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="current" 
                      fill="#0ea5e9" 
                      radius={[0, 4, 4, 0]}
                      name="Current Month"
                    />
                    <Bar 
                      dataKey="previous" 
                      fill="#cbd5e1" 
                      radius={[0, 4, 4, 0]}
                      name="Previous Month"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </div>
        )}
        
        {viewType === "pie" && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {displayData.slice(0, 5).map((category) => (
              <div key={category.name} className="flex flex-col items-center border rounded-lg p-2">
                <div 
                  className="h-3 w-3 rounded-full mb-1"
                  style={{ backgroundColor: category.color }}
                />
                <h4 className="text-xs font-medium text-center truncate w-full">
                  {category.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(category.value)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryAnalysisChart;
