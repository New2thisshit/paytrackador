
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, TrendingUpIcon } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface CashFlowData {
  date: string;
  inflow: number;
  outflow: number;
  balance: number;
}

interface CashFlowSummaryCardsProps {
  cashFlowData: CashFlowData[];
}

export const CashFlowSummaryCards: React.FC<CashFlowSummaryCardsProps> = ({ cashFlowData }) => {
  const totalInflow = cashFlowData.reduce((sum, data) => sum + data.inflow, 0);
  const totalOutflow = cashFlowData.reduce((sum, data) => sum + data.outflow, 0);
  const totalBalance = cashFlowData.reduce((sum, data) => sum + data.balance, 0);
  
  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      <Card className="shadow-none border bg-muted/10">
        <CardContent className="p-4">
          <div className="flex items-center mb-2">
            <ArrowDownIcon className="h-4 w-4 text-finance-income mr-2" />
            <span className="text-sm font-medium">Total Income</span>
          </div>
          <p className="text-xl font-bold">
            {formatCurrency(totalInflow)}
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow-none border bg-muted/10">
        <CardContent className="p-4">
          <div className="flex items-center mb-2">
            <ArrowUpIcon className="h-4 w-4 text-finance-expense mr-2" />
            <span className="text-sm font-medium">Total Expenses</span>
          </div>
          <p className="text-xl font-bold">
            {formatCurrency(totalOutflow)}
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow-none border bg-muted/10">
        <CardContent className="p-4">
          <div className="flex items-center mb-2">
            <TrendingUpIcon className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-medium">Net Cash Flow</span>
          </div>
          <p className="text-xl font-bold">
            {formatCurrency(totalBalance)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
