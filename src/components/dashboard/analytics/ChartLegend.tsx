
import React from "react";

interface ChartLegendProps {
  items: Array<{
    color: string;
    label: string;
  }>;
}

export const ChartLegend: React.FC<ChartLegendProps> = ({ items }) => {
  return (
    <div className="flex items-center space-x-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <span className={`w-3 h-3 rounded-full bg-${item.color} mr-2`} />
          <span className="text-xs">{item.label}</span>
        </div>
      ))}
    </div>
  );
};
