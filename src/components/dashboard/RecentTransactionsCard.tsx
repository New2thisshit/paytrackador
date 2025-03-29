
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "lucide-react";
import { Transaction } from "@/lib/supabase";
import { Link } from "react-router-dom";
import TransactionCard from "@/components/ui/TransactionCard";

interface RecentTransactionsCardProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const RecentTransactionsCard = ({ transactions, isLoading }: RecentTransactionsCardProps) => {
  // Get the 3 most recent transactions for the dashboard
  const recentTransactions = transactions
    .slice(0, 3)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Latest financial activity
            </CardDescription>
          </div>
          {recentTransactions.length > 0 && (
            <Badge className="hover:bg-primary/20">
              {recentTransactions.length} transactions
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-md bg-muted animate-pulse" />
            ))}
          </div>
        ) : recentTransactions.length > 0 ? (
          <>
            {recentTransactions.map(transaction => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
            
            <Button variant="outline" className="w-full mt-2" asChild>
              <Link to="/transactions">
                View All Transactions
                <ArrowRightIcon className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No transactions in selected period</p>
            <Button variant="outline" className="mt-2" asChild>
              <Link to="/transactions">
                Add Transaction
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactionsCard;
