
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUpIcon } from "lucide-react";
import { DateRange } from "@/hooks/useDateRange";
import { Transaction } from "@/lib/supabase";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CashFlowChart } from "./analytics/CashFlowChart";
import { CashFlowLegend } from "./analytics/CashFlowLegend";
import { CashFlowSummaryCards } from "./analytics/CashFlowSummaryCards";
import { useCashFlowData, CashFlowViewType } from "@/hooks/useCashFlowData";

interface CashFlowAnalysisProps {
  transactions: Transaction[];
  dateRange: DateRange;
}

const CashFlowAnalysis = ({ transactions, dateRange }: CashFlowAnalysisProps) => {
  const isMobile = useIsMobile();
  const [view, setView] = useState<CashFlowViewType>("weekly");
  
  const { cashFlowData, shouldShowMonthlyView } = useCashFlowData(transactions, dateRange, view);

  // If we don't have enough data for monthly view, default to weekly
  useEffect(() => {
    if (cashFlowData.length <= 2 && view === "monthly") {
      setView("weekly");
    }
  }, [cashFlowData, view]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <TrendingUpIcon className="h-5 w-5 mr-2 text-primary" />
              Cash Flow Analysis
            </CardTitle>
            <CardDescription>
              Income vs. Expenses over time
            </CardDescription>
          </div>
          
          {shouldShowMonthlyView && (
            <Tabs value={view} onValueChange={(v) => setView(v as CashFlowViewType)}>
              <TabsList>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <CashFlowLegend />
        <CashFlowChart cashFlowData={cashFlowData} />
        <CashFlowSummaryCards cashFlowData={cashFlowData} />
      </CardContent>
    </Card>
  );
};

export default CashFlowAnalysis;
