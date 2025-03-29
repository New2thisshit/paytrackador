
import React from "react";
import { formatCurrency } from "@/utils/formatters";

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-effect p-3 rounded-lg border shadow-sm">
        <p className="font-medium text-sm">{label}</p>
        <div className="mt-2 space-y-1">
          <p className="text-xs flex items-center">
            <span className="w-3 h-3 rounded-full bg-finance-income mr-2" />
            Income: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-xs flex items-center">
            <span className="w-3 h-3 rounded-full bg-finance-expense mr-2" />
            Expenses: {formatCurrency(payload[1].value)}
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export const CategoryTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-effect p-3 rounded-lg border shadow-sm">
        <p className="font-medium text-sm">{payload[0].payload.name}</p>
        <p className="text-xs mt-1">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }

  return null;
};
