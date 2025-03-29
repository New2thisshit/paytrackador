
import React from "react";
import { formatCurrency } from "@/utils/formatters";

interface CashFlowTooltipProps {
  active: boolean;
  payload: any[];
  label: string;
}

export const CashFlowTooltip: React.FC<CashFlowTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-sm p-3">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center mt-1">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-muted-foreground">{entry.name}: </span>
            <span className="text-xs font-medium ml-1">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};
