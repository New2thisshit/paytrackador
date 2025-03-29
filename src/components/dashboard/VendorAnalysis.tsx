
import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/lib/supabase";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpRightIcon, 
  ArrowDownRightIcon, 
  BuildingIcon, 
  InfoIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatters";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface VendorAnalysisProps {
  transactions: Transaction[];
}

interface VendorData {
  name: string;
  totalSpent: number;
  averageAmount: number;
  transactionCount: number;
  lastTransaction: string;
  frequency: number; // days between transactions
}

const VendorAnalysis = ({ transactions }: VendorAnalysisProps) => {
  // Only analyze expenses (negative amounts)
  const expenseTransactions = transactions.filter(t => t.amount < 0);
  
  // Group transactions by vendor (description)
  const vendorData = useMemo(() => {
    if (!expenseTransactions.length) return [];
    
    // Group by description (vendor)
    const vendorGroups: Record<string, Transaction[]> = {};
    
    expenseTransactions.forEach(transaction => {
      const vendor = transaction.description;
      if (!vendorGroups[vendor]) {
        vendorGroups[vendor] = [];
      }
      vendorGroups[vendor].push(transaction);
    });
    
    // Calculate metrics for each vendor
    const result: VendorData[] = Object.entries(vendorGroups).map(([name, transactions]) => {
      // Sort transactions by date (newest first)
      const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      const totalSpent = Math.abs(transactions.reduce((sum, t) => sum + t.amount, 0));
      const averageAmount = totalSpent / transactions.length;
      const lastTransaction = sortedTransactions[0].date;
      
      // Calculate average days between transactions
      let frequency = 0;
      if (sortedTransactions.length > 1) {
        const oldestDate = new Date(sortedTransactions[sortedTransactions.length - 1].date);
        const newestDate = new Date(sortedTransactions[0].date);
        const daysDiff = (newestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24);
        frequency = daysDiff / (sortedTransactions.length - 1);
      }
      
      return {
        name,
        totalSpent,
        averageAmount,
        transactionCount: transactions.length,
        lastTransaction,
        frequency
      };
    });
    
    // Sort by total spent (highest first)
    return result.sort((a, b) => b.totalSpent - a.totalSpent);
  }, [expenseTransactions]);
  
  // Format frequency as human readable
  const formatFrequency = (days: number): string => {
    if (!days || !isFinite(days)) return "One-time";
    if (days < 1) return "Multiple per day";
    if (days < 2) return "Daily";
    if (days < 8) return "Weekly";
    if (days < 15) return "Bi-weekly";
    if (days < 35) return "Monthly";
    if (days < 95) return "Quarterly";
    if (days < 190) return "Bi-annually";
    return "Annually";
  };
  
  // Show only top vendors
  const topVendors = vendorData.slice(0, 6);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <BuildingIcon className="h-5 w-5 mr-2 text-primary" />
          Top Vendors
        </CardTitle>
        <CardDescription>
          Your frequent payment recipients
        </CardDescription>
      </CardHeader>
      <CardContent>
        {topVendors.length === 0 ? (
          <div className="flex items-center justify-center p-6 text-center">
            <p className="text-muted-foreground">No vendor data available</p>
          </div>
        ) : (
          <div className="rounded-md border animate-fade-in">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead className="text-center">Frequency</TableHead>
                  <TableHead className="text-right">Average</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topVendors.map((vendor) => (
                  <TableRow key={vendor.name} className="group transition-colors hover:bg-muted/30">
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {vendor.name}
                        {vendor.transactionCount > 4 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <InfoIcon className="h-3.5 w-3.5 ml-1.5 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">
                                  {vendor.transactionCount} transactions
                                  <br />
                                  Last payment: {new Date(vendor.lastTransaction).toLocaleDateString()}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(vendor.totalSpent)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-xs">
                        {formatFrequency(vendor.frequency)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {formatCurrency(vendor.averageAmount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {vendorData.length > topVendors.length && (
          <Button variant="outline" className="w-full mt-4" size="sm">
            View all {vendorData.length} vendors
            <ArrowDownRightIcon className="ml-1.5 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default VendorAnalysis;
