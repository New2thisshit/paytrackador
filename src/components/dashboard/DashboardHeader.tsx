
import React from "react";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange, DateRangeOption } from "@/hooks/useDateRange";
import { useToast } from "@/hooks/use-toast";
import { Transaction } from "@/lib/supabase";
import { exportToCSV, generateFinancialReport } from "@/utils/exportUtils";

interface DashboardHeaderProps {
  dateRange: DateRange;
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
  onOptionChange: (option: DateRangeOption) => void;
  selectedOption: DateRangeOption;
  filteredTransactions: Transaction[];
}

const DashboardHeader = ({ 
  dateRange, 
  onDateRangeChange, 
  onOptionChange, 
  selectedOption,
  filteredTransactions 
}: DashboardHeaderProps) => {
  const { toast } = useToast();

  const handleExportReport = () => {
    if (!filteredTransactions.length) {
      toast({
        title: "No data to export",
        description: "There are no transactions in the selected date range.",
        variant: "destructive",
      });
      return;
    }
    
    const report = generateFinancialReport(
      filteredTransactions, 
      dateRange
    );
    
    exportToCSV(
      filteredTransactions, 
      `financial_report_${dateRange.label.replace(/ /g, '_')}`,
      dateRange
    );
    
    toast({
      title: "Report exported",
      description: `${filteredTransactions.length} transactions exported for ${dateRange.label}`,
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Financial overview and recent activity
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:space-x-2">
        <DateRangePicker
          dateRange={{
            from: dateRange.startDate,
            to: dateRange.endDate,
          }}
          onDateRangeChange={onDateRangeChange}
          onOptionChange={onOptionChange}
          selectedOption={selectedOption}
        />
        <Button onClick={handleExportReport}>
          <DownloadIcon className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
