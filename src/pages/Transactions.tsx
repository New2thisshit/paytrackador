
import React, { useState } from "react";
import { DateRange } from "@/hooks/useDateRange";
import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import { Transaction } from "@/lib/supabase";
import { exportToCSV } from "@/utils/exportUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useDateRange } from "@/hooks/useDateRange";
import { Download, FileText, Filter } from "lucide-react";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import { Skeleton } from "@/components/ui/skeleton";
import TransactionFilters from "@/components/transactions/TransactionFilters";

const Transactions = () => {
  const { user } = useAuth();
  const { 
    selectedOption, 
    setSelectedOption, 
    currentDateRange, 
    setCustomDateRange 
  } = useDateRange();
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterAmountMin, setFilterAmountMin] = useState<string>("");
  const [filterAmountMax, setFilterAmountMax] = useState<string>("");

  // Get transactions data
  const { 
    transactions, 
    isLoading, 
    error 
  } = useTransactions(user?.id);

  // Apply date range filtering
  const filteredByDate = transactions?.filter(transaction => {
    if (!currentDateRange) return true;
    
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate >= currentDateRange.startDate &&
      transactionDate <= currentDateRange.endDate
    );
  }) || [];

  // Apply additional filters
  const filteredTransactions = filteredByDate.filter(transaction => {
    // Status filter
    if (filterStatus && transaction.status !== filterStatus) return false;
    
    // Category filter
    if (filterCategory && transaction.category !== filterCategory) return false;
    
    // Amount range filter
    const amount = Math.abs(transaction.amount);
    if (filterAmountMin && amount < parseFloat(filterAmountMin)) return false;
    if (filterAmountMax && amount > parseFloat(filterAmountMax)) return false;
    
    return true;
  });

  // Get unique categories
  const categories = [...new Set(transactions?.map(t => t.category) || [])];
  
  // Handle export
  const handleExport = () => {
    if (filteredTransactions.length > 0) {
      exportToCSV(
        filteredTransactions, 
        'transactions_export', 
        currentDateRange ? {
          startDate: currentDateRange.startDate,
          endDate: currentDateRange.endDate
        } : undefined
      );
    }
  };

  // Handle date change
  const handleDateRangeChange = (range: DateRange) => {
    if (range.from && range.to) {
      setCustomDateRange(range.from, range.to);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <DateRangePicker
            dateRange={{
              from: currentDateRange.startDate,
              to: currentDateRange.endDate
            }}
            onDateRangeChange={handleDateRangeChange}
            onOptionChange={setSelectedOption}
            selectedOption={selectedOption}
          />
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleExport}
              disabled={filteredTransactions.length === 0}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>
      
      {showFilters && (
        <TransactionFilters
          categories={categories}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterAmountMin={filterAmountMin}
          setFilterAmountMin={setFilterAmountMin}
          filterAmountMax={filterAmountMax}
          setFilterAmountMax={setFilterAmountMax}
        />
      )}
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <p className="text-destructive">Error loading transactions</p>
              <Button variant="outline" className="mt-4">
                Try again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Transaction List
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({filteredTransactions.length} transactions)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionsTable 
                transactions={filteredTransactions} 
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Transactions;
