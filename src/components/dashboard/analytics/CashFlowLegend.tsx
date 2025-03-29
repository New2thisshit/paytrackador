
import React from "react";

export const CashFlowLegend: React.FC = () => {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <div className="flex items-center">
        <span className="w-3 h-3 rounded-full bg-finance-income mr-2" />
        <span className="text-xs">Income</span>
      </div>
      <div className="flex items-center">
        <span className="w-3 h-3 rounded-full bg-finance-expense mr-2" />
        <span className="text-xs">Expenses</span>
      </div>
      <div className="flex items-center">
        <span className="w-3 h-3 rounded-full bg-primary mr-2" />
        <span className="text-xs">Net Flow</span>
      </div>
    </div>
  );
};
