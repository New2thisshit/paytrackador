
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownIcon, ArrowUpIcon, MoreVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface TransactionCardProps {
  transaction: {
    id: string;
    description: string;
    amount: number;
    category: string;
    date: string;
    status: string;
  };
}

const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  const isIncome = transaction.amount > 0;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center mr-3",
              isIncome ? "bg-finance-income/10" : "bg-finance-expense/10"
            )}>
              {isIncome ? (
                <ArrowDownIcon className="h-5 w-5 text-finance-income" />
              ) : (
                <ArrowUpIcon className="h-5 w-5 text-finance-expense" />
              )}
            </div>
            
            <div>
              <h3 className="font-medium text-sm line-clamp-1">
                {transaction.description}
              </h3>
              <div className="flex items-center mt-1">
                <span className="text-xs text-muted-foreground mr-2">
                  {formatDate(transaction.date)}
                </span>
                <Badge variant="outline" className="text-xs bg-muted/30">
                  {transaction.category}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="flex items-center">
              <span className={cn(
                "font-semibold tabular-nums",
                isIncome ? "text-finance-income" : "text-finance-expense"
              )}>
                {isIncome ? "+" : ""}{formatCurrency(transaction.amount)}
              </span>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 ml-1">
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Edit Transaction</DropdownMenuItem>
                  <DropdownMenuItem>Add Note</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    Delete Transaction
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <Badge 
              variant={transaction.status === "completed" ? "default" : "outline"}
              className={cn(
                "text-xs mt-1",
                transaction.status === "pending" && "text-finance-pending border-finance-pending"
              )}
            >
              {transaction.status === "completed" ? "Completed" : "Pending"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionCard;
