
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, ListIcon } from "lucide-react";
import { Transaction } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import TransactionCard from "@/components/ui/TransactionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { DateRange } from "@/hooks/useDateRange";
import { parseISO, isWithinInterval } from "date-fns";

interface TransactionListProps {
  limit?: number;
  dateRange?: DateRange; // Make this optional with a ?
}

const TransactionList = ({ limit = 10, dateRange }: TransactionListProps) => {
  const { user } = useAuth();
  const { transactions, isLoading } = useTransactions(user?.id);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  
  // Filter transactions based on date range if provided
  useEffect(() => {
    if (!transactions) {
      setFilteredTransactions([]);
      return;
    }
    
    if (dateRange) {
      const filtered = transactions.filter(transaction => {
        const transactionDate = parseISO(transaction.date);
        return isWithinInterval(transactionDate, { 
          start: dateRange.startDate, 
          end: dateRange.endDate 
        });
      });
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(transactions);
    }
  }, [transactions, dateRange]);
  
  // Calculate pagination values
  const totalTransactions = filteredTransactions.length;
  const totalPages = Math.ceil(totalTransactions / limit);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
  
  // Handle page navigation
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <ListIcon className="h-5 w-5 mr-2 text-primary" />
              Transactions
            </CardTitle>
            <CardDescription>
              {dateRange 
                ? `Transactions for ${dateRange.label}` 
                : 'Your recent transaction history'}
            </CardDescription>
          </div>
          
          {totalTransactions > 0 && (
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, totalTransactions)} of {totalTransactions}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: limit }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : paginatedTransactions.length > 0 ? (
          <>
            <div className="space-y-3">
              {paginatedTransactions.map(transaction => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                
                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No transactions found</p>
            <Button variant="outline" className="mt-4">
              Add Transaction
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionList;
