
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { CashFlowTooltip } from "./CashFlowTooltip";

interface CashFlowData {
  date: string;
  inflow: number;
  outflow: number;
  balance: number;
}

interface CashFlowChartProps {
  cashFlowData: CashFlowData[];
  isLoading?: boolean;
}

export const CashFlowChart: React.FC<CashFlowChartProps> = ({ cashFlowData, isLoading }) => {
  return (
    <div className="h-[300px] w-full">
      {isLoading ? (
        <Skeleton className="h-full w-full" />
      ) : cashFlowData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={cashFlowData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 40,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              height={40}
              tickLine={false}
              angle={-45}
              textAnchor="end"
            />
            <YAxis 
              tickFormatter={(value) => `$${Math.abs(value) >= 1000 ? `${Math.round(value/1000)}k` : value}`}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <CashFlowTooltip />
            <Bar dataKey="inflow" name="Income" fill="#0A84FF" radius={[4, 4, 0, 0]} />
            <Bar dataKey="outflow" name="Expenses" fill="#FF453A" radius={[4, 4, 0, 0]} />
            <Bar dataKey="balance" name="Net" fill="#34C759" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">No data available for the selected period</p>
        </div>
      )}
    </div>
  );
};
