
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  FilterIcon,
  SearchIcon,
  SlidersIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Sample transaction data
const transactions = [
  {
    id: "1",
    date: "2023-09-01",
    description: "Office Supplies",
    amount: -142.55,
    category: "Office",
    status: "completed",
  },
  {
    id: "2",
    date: "2023-09-03",
    description: "Client Payment - XYZ Corp",
    amount: 3500.00,
    category: "Income",
    status: "completed",
  },
  {
    id: "3",
    date: "2023-09-05",
    description: "Monthly Rent",
    amount: -2200.00,
    category: "Rent",
    status: "completed",
  },
  {
    id: "4",
    date: "2023-09-10",
    description: "Utility Bills",
    amount: -218.45,
    category: "Utilities",
    status: "completed",
  },
  {
    id: "5",
    date: "2023-09-15",
    description: "Software Subscription",
    amount: -49.99,
    category: "Software",
    status: "pending",
  },
  {
    id: "6",
    date: "2023-09-20",
    description: "Client Payment - ABC Inc.",
    amount: 1250.00,
    category: "Income",
    status: "completed",
  },
  {
    id: "7",
    date: "2023-09-25",
    description: "Marketing Expenses",
    amount: -350.75,
    category: "Marketing",
    status: "pending",
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

interface TransactionListProps {
  limit?: number;
  showHeader?: boolean;
}

const TransactionList = ({ limit, showHeader = true }: TransactionListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };
  
  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(transaction => 
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "amount") {
        return sortDirection === "asc" 
          ? a.amount - b.amount
          : b.amount - a.amount;
      } else if (sortBy === "date") {
        return sortDirection === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return sortDirection === "asc"
          ? a[sortBy as keyof typeof a] > b[sortBy as keyof typeof b] ? 1 : -1
          : a[sortBy as keyof typeof a] < b[sortBy as keyof typeof b] ? 1 : -1;
      }
    });
  
  // Limit the number of transactions if specified
  const displayedTransactions = limit 
    ? filteredTransactions.slice(0, limit)
    : filteredTransactions;

  return (
    <Card className="shadow-sm">
      {showHeader && (
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Monitor your latest financial activities
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-9 w-full md:w-[240px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <FilterIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem>All Transactions</DropdownMenuItem>
                  <DropdownMenuItem>Income Only</DropdownMenuItem>
                  <DropdownMenuItem>Expenses Only</DropdownMenuItem>
                  <DropdownMenuItem>Pending Transactions</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button size="icon" variant="outline">
                <SlidersIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      )}
      
      <CardContent>
        <div className="rounded-md border overflow-hidden animate-fade-in">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Date
                    {sortBy === "date" && (
                      sortDirection === "asc" 
                        ? <ArrowUpIcon className="ml-1 h-3 w-3" /> 
                        : <ArrowDownIcon className="ml-1 h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("description")}
                >
                  <div className="flex items-center">
                    Description
                    {sortBy === "description" && (
                      sortDirection === "asc" 
                        ? <ArrowUpIcon className="ml-1 h-3 w-3" /> 
                        : <ArrowDownIcon className="ml-1 h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-center">Category</TableHead>
                <TableHead 
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center justify-end">
                    Amount
                    {sortBy === "amount" && (
                      sortDirection === "asc" 
                        ? <ArrowUpIcon className="ml-1 h-3 w-3" /> 
                        : <ArrowDownIcon className="ml-1 h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedTransactions.length > 0 ? (
                displayedTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="group transition-colors hover:bg-muted/30">
                    <TableCell className="font-mono">{formatDate(transaction.date)}</TableCell>
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-xs">
                        {transaction.category}
                      </Badge>
                    </TableCell>
                    <TableCell className={cn(
                      "text-right font-medium tabular-nums",
                      transaction.amount > 0 ? "text-finance-income" : "text-finance-expense"
                    )}>
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={transaction.status === "completed" ? "default" : "outline"}
                        className={cn(
                          "text-xs",
                          transaction.status === "pending" && "text-finance-pending border-finance-pending"
                        )}
                      >
                        {transaction.status === "completed" ? "Completed" : "Pending"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {!limit && (
          <div className="mt-4 flex items-center justify-between">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{displayedTransactions.length}</span> of{" "}
              <span className="font-medium">{transactions.length}</span> transactions
            </div>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        )}
        
        {limit && filteredTransactions.length > limit && (
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              View All Transactions
              <ChevronDownIcon className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionList;
