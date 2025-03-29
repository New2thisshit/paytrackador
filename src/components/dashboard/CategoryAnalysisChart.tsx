
import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/lib/supabase";
import { ChartIcon, PieChartIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface CategoryAnalysisChartProps {
  transactions: Transaction[];
}

const CHART_COLORS = [
  "#0A84FF", // Blue
  "#FF9500", // Orange
  "#34C759", // Green
  "#FF2D55", // Pink
  "#AF52DE", // Purple
  "#5856D6", // Indigo
  "#FFCC00", // Yellow
  "#FF3B30", // Red
  "#5AC8FA", // Light Blue
  "#007AFF", // Royal Blue
  "#4CD964", // Bright Green
  "#FF2D55", // Pink
];

// Category tooltip component
const CategoryTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-sm p-3">
        <p className="font-medium text-sm">{payload[0].name}</p>
        <p className="text-xs mt-1">{formatCurrency(payload[0].value)}</p>
        <p className="text-xs text-muted-foreground">
          {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}% of total
        </p>
      </div>
    );
  }
  return null;
};

const NoDataDisplay = () => (
  <div className="flex flex-col items-center justify-center h-[300px] text-center">
    <PieChartIcon className="h-10 w-10 text-muted-foreground/50 mb-2" />
    <h3 className="text-sm font-medium">No Data Available</h3>
    <p className="text-xs text-muted-foreground mt-1">
      There are no transactions in the selected period
    </p>
  </div>
);

const CategoryAnalysisChart = ({ transactions }: CategoryAnalysisChartProps) => {
  const [activeTab, setActiveTab] = useState<"spending" | "income">("spending");
  
  // Prepare data for the pie chart
  const { categoryData, topCategories, otherCategories, hasData } = useMemo(() => {
    if (!transactions?.length) return { 
      categoryData: [], 
      topCategories: [],
      otherCategories: [],
      hasData: false
    };
    
    // Filter for either spending or income based on active tab
    const filteredTransactions = transactions.filter(t => 
      activeTab === "spending" ? t.amount < 0 : t.amount > 0
    );
    
    if (!filteredTransactions.length) return { 
      categoryData: [], 
      topCategories: [],
      otherCategories: [],
      hasData: false
    };
    
    // Group by category and sum amounts
    const categorySums = filteredTransactions.reduce((acc, t) => {
      const category = t.category || "Uncategorized";
      const amount = Math.abs(t.amount);
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);
    
    // Convert to array and sort by amount
    const sortedCategories = Object.entries(categorySums)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    
    // Calculate total amount for percentage calculation
    const total = sortedCategories.reduce((sum, cat) => sum + cat.value, 0);
    
    // Take top categories and group the rest as "Other"
    const topN = 8; // Number of top categories to display
    const topCategories = sortedCategories.slice(0, topN).map((cat, i) => ({
      ...cat,
      color: CHART_COLORS[i % CHART_COLORS.length],
      total
    }));
    
    // Calculate "Other" category if needed
    const otherValue = sortedCategories.slice(topN).reduce((sum, cat) => sum + cat.value, 0);
    const otherCategories = sortedCategories.slice(topN);
    
    let categoryData = topCategories;
    
    // Add "Other" category if it exists
    if (otherValue > 0) {
      categoryData.push({
        name: "Other",
        value: otherValue,
        color: "#8E8E93", // Gray color for "Other"
        total
      });
    }
    
    return { 
      categoryData, 
      topCategories,
      otherCategories,
      hasData: true 
    };
  }, [transactions, activeTab]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <PieChartIcon className="h-5 w-5 mr-2 text-primary" />
              Category Analysis
            </CardTitle>
            <CardDescription>
              Breakdown of your {activeTab === "spending" ? "expenses" : "income"}
            </CardDescription>
          </div>
          
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "spending" | "income")}>
            <TabsList>
              <TabsTrigger value="spending">Spending</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-[300px] flex items-center justify-center">
            {!transactions ? (
              <Skeleton className="h-full w-full rounded-full" />
            ) : hasData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CategoryTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <NoDataDisplay />
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-4">
              Top Categories {activeTab === "spending" ? "Expenses" : "Income"}
            </h3>
            
            {hasData ? (
              <div className="space-y-2">
                {topCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }} />
                      <span className="text-sm">{category.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{formatCurrency(category.value)}</span>
                      <Badge variant="outline" className="text-xs">
                        {((category.value / category.total) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {otherCategories.length > 0 && (
                  <Button variant="ghost" size="sm" className="text-xs mt-2 w-full justify-start">
                    Show {otherCategories.length} more categories
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No categories available
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryAnalysisChart;
