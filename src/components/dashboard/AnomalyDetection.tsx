
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/lib/supabase";
import { 
  AlertCircleIcon, 
  AlertTriangleIcon, 
  ArrowUpIcon,
  BellOffIcon, 
  CheckCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatters";

interface AnomalyDetectionProps {
  transactions: Transaction[];
}

const AnomalyDetection = ({ transactions }: AnomalyDetectionProps) => {
  // Simple algorithm to detect unusual transactions (those exceeding 2x the average amount)
  const detectAnomalies = (transactions: Transaction[]) => {
    if (!transactions.length) return [];
    
    // Calculate average transaction amount
    const totalAmount = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const avgAmount = totalAmount / transactions.length;
    const threshold = avgAmount * 2; // Set threshold at 2x average
    
    // Find transactions exceeding the threshold
    return transactions.filter(t => Math.abs(t.amount) > threshold);
  };
  
  // Detect potential duplicate transactions (same amount and category within 3 days)
  const detectDuplicates = (transactions: Transaction[]) => {
    const potentialDuplicates: Transaction[] = [];
    
    transactions.forEach((transaction, i) => {
      for (let j = i + 1; j < transactions.length; j++) {
        const t1 = transaction;
        const t2 = transactions[j];
        
        // Check if amounts and categories match
        if (t1.amount === t2.amount && t1.category === t2.category) {
          // Check if within 3 days of each other
          const date1 = new Date(t1.date);
          const date2 = new Date(t2.date);
          const diffTime = Math.abs(date2.getTime() - date1.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays <= 3) {
            potentialDuplicates.push(t1);
            break; // Only add once
          }
        }
      }
    });
    
    return potentialDuplicates;
  };
  
  // Only use most recent transactions for anomaly detection
  const recentTransactions = transactions.slice(0, 20);
  const anomalies = detectAnomalies(recentTransactions);
  const duplicates = detectDuplicates(recentTransactions);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertCircleIcon className="h-5 w-5 mr-2 text-destructive" />
          Anomaly Detection
        </CardTitle>
        <CardDescription>
          Potential issues in your transaction history
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!anomalies.length && !duplicates.length ? (
          <div className="flex items-center justify-center p-6 text-center">
            <div>
              <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-medium">No Anomalies Detected</h3>
              <p className="text-muted-foreground mt-1">
                Your recent transactions appear to be within normal patterns
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {anomalies.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <AlertTriangleIcon className="h-4 w-4 mr-1 text-amber-500" />
                  Unusual Transaction Amounts
                </h3>
                <div className="space-y-2">
                  {anomalies.slice(0, 3).map((transaction) => (
                    <Alert key={transaction.id} variant="destructive" className="bg-destructive/10 border-destructive/20">
                      <div className="flex justify-between items-start">
                        <div>
                          <AlertTitle className="font-medium">{transaction.description}</AlertTitle>
                          <AlertDescription className="text-sm">
                            {formatCurrency(transaction.amount)} on {new Date(transaction.date).toLocaleDateString()}
                          </AlertDescription>
                        </div>
                        <Badge variant="destructive" className="ml-2">Unusual Amount</Badge>
                      </div>
                    </Alert>
                  ))}
                  
                  {anomalies.length > 3 && (
                    <Button variant="link" className="pl-0">
                      View {anomalies.length - 3} more unusual transactions
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {duplicates.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <ArrowUpIcon className="h-4 w-4 mr-1 text-amber-500" />
                  Potential Duplicate Payments
                </h3>
                <div className="space-y-2">
                  {duplicates.slice(0, 2).map((transaction) => (
                    <Alert key={transaction.id} className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-900">
                      <div className="flex justify-between items-start">
                        <div>
                          <AlertTitle className="font-medium">{transaction.description}</AlertTitle>
                          <AlertDescription className="text-sm">
                            {formatCurrency(transaction.amount)} on {new Date(transaction.date).toLocaleDateString()}
                          </AlertDescription>
                        </div>
                        <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-700">
                          Potential Duplicate
                        </Badge>
                      </div>
                    </Alert>
                  ))}
                  
                  {duplicates.length > 2 && (
                    <Button variant="link" className="pl-0">
                      View {duplicates.length - 2} more potential duplicates
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnomalyDetection;
