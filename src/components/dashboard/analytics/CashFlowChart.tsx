
import React from "react";
import { 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ComposedChart, 
  ResponsiveContainer 
} from "recharts";
import { CashFlowTooltip, CashFlowTooltipProps } from "./CashFlowTooltip";

export interface CashFlowChartProps {
  cashFlowData: Array<{
    date: string;
    inflow: number;
    outflow: number;
    balance: number;
  }>;
}

export const CashFlowChart: React.FC<CashFlowChartProps> = ({ cashFlowData }) => {
  // CustomTooltip needs to be properly typed as CashFlowTooltipProps
  const renderTooltip = (props: CashFlowTooltipProps) => {
    return <CashFlowTooltip {...props} />;
  };
  
  if (cashFlowData.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-muted-foreground">
        No cash flow data available
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={cashFlowData}
          margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis
            tickFormatter={(value) => `$${value}`}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <Tooltip content={renderTooltip} />
          <Bar
            dataKey="inflow"
            name="Income"
            fill="var(--finance-income)"
            barSize={24}
            radius={4}
          />
          <Bar
            dataKey="outflow"
            name="Expenses"
            fill="var(--finance-expense)"
            barSize={24}
            radius={4}
          />
          <Line
            type="monotone"
            dataKey="balance"
            name="Net Flow"
            stroke="var(--primary)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
