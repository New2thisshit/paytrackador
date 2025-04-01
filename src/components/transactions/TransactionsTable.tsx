
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/lib/supabase";
import { formatCurrency } from "@/utils/formatters";
import { format } from "date-fns";
import { ChevronDownIcon, ChevronUpIcon, MoreVerticalIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionsTableProps {
  transactions: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions }) => {
  const [sortField, setSortField] = useState<keyof Transaction>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // Handle sorting
  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Toggle row expansion
  const toggleRowExpand = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Sort transactions
  const sortedTransactions = [...transactions].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case "date":
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case "amount":
        comparison = a.amount - b.amount;
        break;
      case "description":
      case "category":
      case "status":
        comparison = a[sortField].localeCompare(b[sortField]);
        break;
      default:
        comparison = 0;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "outline";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>Transaction history</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("date")}
            >
              <div className="flex items-center">
                Date
                {sortField === "date" && (
                  sortDirection === "asc" ? 
                    <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("description")}
            >
              <div className="flex items-center">
                Description
                {sortField === "description" && (
                  sortDirection === "asc" ? 
                    <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("category")}
            >
              <div className="flex items-center">
                Category
                {sortField === "category" && (
                  sortDirection === "asc" ? 
                    <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer text-right"
              onClick={() => handleSort("amount")}
            >
              <div className="flex items-center justify-end">
                Amount
                {sortField === "amount" && (
                  sortDirection === "asc" ? 
                    <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center">
                Status
                {sortField === "status" && (
                  sortDirection === "asc" ? 
                    <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No transactions found.
              </TableCell>
            </TableRow>
          ) : (
            sortedTransactions.map((transaction) => (
              <React.Fragment key={transaction.id}>
                <TableRow className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleRowExpand(transaction.id)}
                      className="h-6 w-6"
                    >
                      {expandedRows[transaction.id] ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-muted/30">
                      {transaction.category}
                    </Badge>
                  </TableCell>
                  <TableCell className={cn(
                    "text-right font-medium tabular-nums",
                    transaction.amount < 0 ? "text-finance-expense" : "text-finance-income"
                  )}>
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit Transaction</DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Add Note</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete Transaction
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                
                {expandedRows[transaction.id] && (
                  <TableRow className="bg-muted/20">
                    <TableCell colSpan={7} className="py-3 px-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Transaction Details</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Transaction ID:</span>
                              <span className="font-mono">{transaction.id.substring(0, 8)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Created:</span>
                              <span>{format(new Date(transaction.created_at), "MMM d, yyyy h:mm a")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">User ID:</span>
                              <span className="font-mono">{transaction.user_id.substring(0, 8)}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Additional Information</h4>
                          <div className="space-y-1 text-sm">
                            <p className="text-muted-foreground mb-2">No notes or attachments.</p>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">Add Note</Button>
                              <Button variant="outline" size="sm">Upload Receipt</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTable;
