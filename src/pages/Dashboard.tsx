
import React from "react";
import AnalyticsSummary from "@/components/dashboard/AnalyticsSummary";
import TransactionList from "@/components/dashboard/TransactionList";
import NotificationCenter from "@/components/dashboard/NotificationCenter";
import TransactionCard from "@/components/ui/TransactionCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircleIcon, ArrowRightIcon, BuildingIcon, CalendarIcon, LucideIcon, PieChartIcon, TrendingUpIcon } from "lucide-react";

// Sample recent transactions
const recentTransactions = [
  {
    id: "1",
    date: "2023-09-25",
    description: "Marketing Expenses",
    amount: -350.75,
    category: "Marketing",
    status: "pending",
  },
  {
    id: "2",
    date: "2023-09-20",
    description: "Client Payment - ABC Inc.",
    amount: 1250.00,
    category: "Income",
    status: "completed",
  },
  {
    id: "3",
    date: "2023-09-15",
    description: "Software Subscription",
    amount: -49.99,
    category: "Software",
    status: "pending",
  },
];

interface QuickActionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

const QuickAction = ({ title, description, icon: Icon, href }: QuickActionProps) => {
  return (
    <Card className="group transition-all duration-300 hover:shadow-md hover:border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mr-3 group-hover:bg-primary group-hover:text-white transition-colors">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Financial overview and recent activity
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Sept 1 - 30, 2023
          </Button>
          <Button>Export Report</Button>
        </div>
      </div>
      
      {/* Alerts */}
      <Alert variant="destructive" className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Attention Required</AlertTitle>
        <AlertDescription>
          High-value transactions detected. Please review and verify in the notifications section.
        </AlertDescription>
      </Alert>
      
      {/* Analytics */}
      <AnalyticsSummary />
      
      {/* Quick Actions and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <QuickAction 
                title="Connect Bank" 
                description="Link another account" 
                icon={BuildingIcon}
                href="/connect-bank"
              />
              <QuickAction 
                title="View Reports" 
                description="Generate financial reports" 
                icon={PieChartIcon}
                href="/reports"
              />
              <QuickAction 
                title="Analytics" 
                description="Advanced financial insights" 
                icon={TrendingUpIcon}
                href="/analytics"
              />
            </CardContent>
          </Card>
          
          <NotificationCenter />
        </div>
        
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Latest financial activity
                  </CardDescription>
                </div>
                <Badge className="hover:bg-primary/20">
                  New transactions
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentTransactions.map(transaction => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
              
              <Button variant="outline" className="w-full mt-2" asChild>
                <a href="/transactions">
                  View All Transactions
                  <ArrowRightIcon className="ml-1.5 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
          
          <TransactionList limit={5} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
