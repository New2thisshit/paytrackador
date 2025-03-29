
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangeOption } from "@/hooks/useDateRange";

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange) => void;
  onOptionChange: (option: DateRangeOption) => void;
  selectedOption: DateRangeOption;
  className?: string;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  onOptionChange,
  selectedOption,
  className,
}: DateRangePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const handleSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      onDateRangeChange({
        from: range.from,
        to: range.to,
      });
      setIsCalendarOpen(false);
    }
  };

  const handleOptionChange = (value: string) => {
    onOptionChange(value as DateRangeOption);
    if (value === 'custom') {
      setIsCalendarOpen(true);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex items-center space-x-2">
        <Select value={selectedOption} onValueChange={handleOptionChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="thisMonth">This Month</SelectItem>
            <SelectItem value="lastMonth">Last Month</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>

        <Popover open={isCalendarOpen || selectedOption === 'custom'} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              onClick={() => selectedOption !== 'custom' && setIsCalendarOpen(true)}
              className={cn(
                "text-left justify-start font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={{
                from: dateRange?.from,
                to: dateRange?.to,
              }}
              onSelect={handleSelect}
              numberOfMonths={2}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
