
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, DollarSignIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AnalyticsSummaryCardProps {
  title: string;
  value: number;
  change?: number;
  changeLabel?: string;
  icon: "income" | "expense" | "net";
  isLoading: boolean;
  formatCurrency: (value: number) => string;
  formatPercentage: (value: number) => string;
  decimals?: number;
  changeDirection?: "normal" | "inverted";
}

export const AnalyticsSummaryCard: React.FC<AnalyticsSummaryCardProps> = ({
  title,
  value,
  change = 0,
  changeLabel,
  icon,
  isLoading,
  formatCurrency,
  formatPercentage,
  decimals,
  changeDirection = "normal"
}) => {
  const iconComponents = {
    income: {
      wrapper: "bg-finance-income/10",
      icon: <ArrowDownIcon className="h-4 w-4 text-finance-income" />
    },
    expense: {
      wrapper: "bg-finance-expense/10",
      icon: <ArrowUpIcon className="h-4 w-4 text-finance-expense" />
    },
    net: {
      wrapper: "bg-primary/10",
      icon: <DollarSignIcon className="h-4 w-4 text-primary" />
    }
  };

  const isPositiveChange = changeDirection === "inverted" 
    ? change <= 0 
    : change >= 0;
  
  return (
    <Card className="bg-muted/10 border shadow-none">
      <CardContent className="p-4">
        {isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className={`rounded-full p-2 ${iconComponents[icon].wrapper}`}>
                {iconComponents[icon].icon}
              </div>
              {change !== 0 && (
                <div className={cn(
                  "text-xs font-medium flex items-center",
                  isPositiveChange ? "text-finance-income" : "text-finance-expense"
                )}>
                  {isPositiveChange ? (
                    <TrendingUpIcon className="h-3.5 w-3.5 mr-1" />
                  ) : (
                    <TrendingDownIcon className="h-3.5 w-3.5 mr-1" />
                  )}
                  {formatPercentage(Math.abs(change))}
                </div>
              )}
            </div>
            
            <div className="mt-3">
              <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
              <p className="text-2xl font-bold mt-1">{formatCurrency(value)}</p>
              {changeLabel && (
                <p className="text-xs text-muted-foreground mt-1">
                  {changeLabel} from previous period
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
