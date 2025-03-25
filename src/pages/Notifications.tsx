
import React from "react";
import NotificationCenter from "@/components/dashboard/NotificationCenter";
import BankConnection from "@/components/dashboard/BankConnection";

const Notifications = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">
          Stay updated on your financial activity
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NotificationCenter />
        </div>
        
        <div className="lg:col-span-1">
          <BankConnection />
        </div>
      </div>
    </div>
  );
};

export default Notifications;
