
import React from "react";
import BankConnection from "@/components/dashboard/BankConnection";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";

const ConnectBank = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center">
            <Button variant="ghost" size="sm" asChild className="mr-2">
              <Link to="/dashboard">
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mt-2">Connect Banks</h1>
          <p className="text-muted-foreground">
            Link your bank accounts to automatically track your finances
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <BankConnection />
      </div>
    </div>
  );
};

export default ConnectBank;
