
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AnalyticsChartArea } from "./AnalyticsChartArea";
import { ChartLegend } from "./ChartLegend";
import { AnalyticsPeriod } from "@/hooks/useAnalytics";

interface AnalyticsPeriodTabsProps {
  period: AnalyticsPeriod;
  onPeriodChange: (value: AnalyticsPeriod) => void;
  weeklyData: any[];
  monthlyData: any[];
  isLoading: boolean;
}

export const AnalyticsPeriodTabs: React.FC<AnalyticsPeriodTabsProps> = ({
  period,
  onPeriodChange,
  weeklyData,
  monthlyData,
  isLoading
}) => {
  return (
    <Tabs 
      defaultValue="monthly" 
      value={period} 
      className="mt-6" 
      onValueChange={(value) => onPeriodChange(value as AnalyticsPeriod)}
    >
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        
        <ChartLegend 
          items={[
            { color: "finance-income", label: "Income" },
            { color: "finance-expense", label: "Expenses" }
          ]} 
        />
      </div>
      
      <TabsContent value="monthly" className="mt-0 animate-fade-in">
        <AnalyticsChartArea data={monthlyData} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="weekly" className="mt-0 animate-fade-in">
        <AnalyticsChartArea data={weeklyData} isLoading={isLoading} />
      </TabsContent>
    </Tabs>
  );
};
