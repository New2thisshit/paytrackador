
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBankConnections, BankConnection } from "@/hooks/useBankConnections";
import { 
  ArrowRightIcon, 
  BuildingIcon, 
  CheckCircleIcon, 
  RefreshCwIcon
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface BankConnectionListProps {
  onConnectClick: (bankId: string) => void;
}

const BankConnectionList = ({ onConnectClick }: BankConnectionListProps) => {
  const { connections, isLoading, fetchConnections, disconnectBank, syncBankData } = useBankConnections();
  const [isDisconnecting, setIsDisconnecting] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  
  useEffect(() => {
    fetchConnections();
  }, []);
  
  const handleSyncNow = async (connectionId: string) => {
    setIsSyncing(connectionId);
    await syncBankData(connectionId);
    setIsSyncing(null);
  };
  
  const handleDisconnect = async (connectionId: string) => {
    setIsDisconnecting(connectionId);
    await disconnectBank(connectionId);
    setIsDisconnecting(null);
  };
  
  const formatLastSync = (timestamp: string | null) => {
    if (!timestamp) return "Never";
    
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  if (isLoading && connections.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {connections.map((connection) => (
        <div 
          key={connection.id}
          className={cn(
            "border rounded-lg p-4 transition-all group",
            connection.status === "connected" 
              ? "bg-card hover:border-primary/40" 
              : "bg-muted/10 hover:bg-card"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center text-muted-foreground">
                <BuildingIcon className="h-6 w-6" />
              </div>
              
              <div>
                <h3 className="font-medium">{connection.bank_name}</h3>
                <div className="flex items-center mt-1">
                  {connection.status === "connected" ? (
                    <>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-2">
                        Last synced: {formatLastSync(connection.last_sync)}
                      </span>
                    </>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground text-xs">
                      Disconnected
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              {connection.status === "connected" ? (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSyncNow(connection.id)}
                    disabled={isSyncing === connection.id}
                  >
                    {isSyncing === connection.id ? (
                      <>
                        <RefreshCwIcon className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCwIcon className="h-3.5 w-3.5 mr-1.5" />
                        Sync Now
                      </>
                    )}
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                      >
                        Disconnect
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Disconnect Bank Account</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to disconnect this bank account? 
                          You will no longer receive automatic transaction updates.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button 
                          variant="destructive"
                          onClick={() => handleDisconnect(connection.id)}
                          disabled={isDisconnecting === connection.id}
                        >
                          {isDisconnecting === connection.id ? "Disconnecting..." : "Disconnect"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onConnectClick(connection.bank_id)}
                >
                  <ArrowRightIcon className="h-3.5 w-3.5 mr-1.5" />
                  Reconnect
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {connections.length === 0 && !isLoading && (
        <div className="text-center p-8 border rounded-lg bg-muted/5">
          <BuildingIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-medium mb-2">No banks connected</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Connect your bank accounts to automatically track transactions and manage your finances
          </p>
        </div>
      )}
    </div>
  );
};

export default BankConnectionList;
