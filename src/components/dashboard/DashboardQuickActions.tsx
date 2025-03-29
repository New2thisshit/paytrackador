
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, BuildingIcon, PieChartIcon, TrendingUpIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
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

const DashboardQuickActions = () => {
  return (
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
  );
};

export default DashboardQuickActions;
