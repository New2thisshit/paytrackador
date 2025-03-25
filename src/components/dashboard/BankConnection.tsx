
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowRightIcon, 
  BankIcon, 
  CheckCircleIcon, 
  ChevronsUpDownIcon, 
  CreditCardIcon, 
  DatabaseIcon, 
  KeyIcon,
  LockIcon, 
  RefreshCwIcon, 
  ShieldIcon 
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
import { useToast } from "@/hooks/use-toast";

const banks = [
  {
    id: "chase",
    name: "Chase Bank",
    logo: "/placeholder.svg",
    connected: true,
    lastSync: "2023-09-15T10:30:00",
  },
  {
    id: "bofa",
    name: "Bank of America",
    logo: "/placeholder.svg",
    connected: false,
    lastSync: null,
  },
  {
    id: "wells",
    name: "Wells Fargo",
    logo: "/placeholder.svg",
    connected: false,
    lastSync: null,
  },
  {
    id: "citi",
    name: "Citibank",
    logo: "/placeholder.svg",
    connected: false,
    lastSync: null,
  },
];

const BankConnection = () => {
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleConnect = () => {
    if (!selectedBank) return;
    
    setIsConnecting(true);
    
    // Simulate API call to connect bank
    setTimeout(() => {
      setIsConnecting(false);
      setIsDialogOpen(false);
      
      toast({
        title: "Bank connected successfully",
        description: "Your bank account has been connected. Transactions will sync shortly.",
        variant: "default",
      });
    }, 2000);
  };
  
  const handleSyncNow = (bankId: string) => {
    setIsSyncing(true);
    
    // Simulate API call to sync bank data
    setTimeout(() => {
      setIsSyncing(false);
      
      toast({
        title: "Account synchronized",
        description: "Your bank account has been synchronized successfully.",
        variant: "default",
      });
    }, 2000);
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

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BankIcon className="h-5 w-5 mr-2 text-primary" />
          Bank Connections
        </CardTitle>
        <CardDescription>
          Connect your bank accounts to automatically track transactions
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="accounts">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="accounts">Connected Accounts</TabsTrigger>
            <TabsTrigger value="api">API Access</TabsTrigger>
          </TabsList>
          
          <TabsContent value="accounts" className="space-y-4 animate-fade-in">
            {banks.map((bank) => (
              <div 
                key={bank.id}
                className={cn(
                  "border rounded-lg p-4 transition-all group",
                  bank.connected 
                    ? "bg-card hover:border-primary/40" 
                    : "bg-muted/10 hover:bg-card"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center text-muted-foreground">
                      <BankIcon className="h-6 w-6" />
                    </div>
                    
                    <div>
                      <h3 className="font-medium">{bank.name}</h3>
                      <div className="flex items-center mt-1">
                        {bank.connected ? (
                          <>
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                              <CheckCircleIcon className="h-3 w-3 mr-1" />
                              Connected
                            </Badge>
                            <span className="text-xs text-muted-foreground ml-2">
                              Last synced: {formatLastSync(bank.lastSync)}
                            </span>
                          </>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground text-xs">
                            Not Connected
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    {bank.connected ? (
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSyncNow(bank.id)}
                          disabled={isSyncing}
                        >
                          {isSyncing ? (
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
                              <Button variant="destructive">Disconnect</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    ) : (
                      <Dialog open={isDialogOpen && selectedBank === bank.id} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) setSelectedBank(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedBank(bank.id)}
                          >
                            <ArrowRightIcon className="h-3.5 w-3.5 mr-1.5" />
                            Connect
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Connect to {bank.name}</DialogTitle>
                            <DialogDescription>
                              Enter your bank credentials to establish a secure connection.
                              All data is encrypted and transmitted securely.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="py-4 space-y-3">
                            <div className="flex items-center p-2 rounded-md bg-primary/5 border border-primary/10">
                              <ShieldIcon className="h-5 w-5 text-primary mr-2" />
                              <span className="text-sm">
                                Your credentials are securely encrypted and never stored on our servers.
                              </span>
                            </div>
                            
                            <div className="space-y-4 mt-4">
                              <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" type="text" />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                  <Input id="password" type="password" />
                                  <LockIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button 
                              variant="outline" 
                              onClick={() => setIsDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleConnect}
                              disabled={isConnecting}
                            >
                              {isConnecting ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Connecting...
                                </>
                              ) : (
                                "Connect Bank"
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full mt-4">
                  <BankIcon className="h-4 w-4 mr-2" />
                  Connect Another Bank
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a New Bank</DialogTitle>
                  <DialogDescription>
                    Search for your bank to establish a secure connection.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                  <div className="relative">
                    <Input
                      placeholder="Search for your bank..."
                      className="pl-10"
                    />
                    <BankIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium mb-2">Popular Banks</h4>
                    
                    {banks.map((bank) => (
                      <div 
                        key={bank.id}
                        className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded bg-muted/50 flex items-center justify-center mr-3">
                            <BankIcon className="h-4 w-4" />
                          </div>
                          <span>{bank.name}</span>
                        </div>
                        <ArrowRightIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          <TabsContent value="api" className="animate-fade-in">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <KeyIcon className="h-4 w-4 mr-2" />
                  API Credentials
                </CardTitle>
                <CardDescription>
                  Manage your API keys for direct bank data access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md bg-muted/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm flex items-center">
                        <DatabaseIcon className="h-4 w-4 mr-1.5" />
                        API Key
                      </h4>
                      <Badge variant="outline" className="text-xs">Production</Badge>
                    </div>
                    
                    <div className="flex items-center mt-2">
                      <Input 
                        value="••••••••••••••••••••••••••••••" 
                        readOnly 
                        className="font-mono bg-muted/20 border-dashed"
                      />
                      <Button variant="outline" size="sm" className="ml-2 whitespace-nowrap">
                        Reveal Key
                      </Button>
                    </div>
                    
                    <div className="mt-3 flex items-center">
                      <p className="text-xs text-muted-foreground">
                        Created on Sep 15, 2023 · Last used 2 hours ago
                      </p>
                      <Button variant="ghost" size="sm" className="text-xs h-6 px-2 ml-auto">
                        Revoke Key
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md bg-muted/5 border-dashed">
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <CreditCardIcon className="h-8 w-8 text-muted-foreground/50 mb-2" />
                      <h3 className="text-base font-medium">Need additional API access?</h3>
                      <p className="text-sm text-muted-foreground max-w-md mt-1 mb-4">
                        Configure additional API keys for specific services or development environments.
                      </p>
                      <Button>
                        <KeyIcon className="h-4 w-4 mr-2" />
                        Generate New API Key
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Documentation</h3>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <Card className="bg-muted/5">
                  <CardContent className="p-4 flex items-center">
                    <div className="mr-4 h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                      <ChevronsUpDownIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">API Reference</h4>
                      <p className="text-xs text-muted-foreground">
                        Comprehensive guide to our REST API endpoints
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted/5">
                  <CardContent className="p-4 flex items-center">
                    <div className="mr-4 h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                      <KeyIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Authentication</h4>
                      <p className="text-xs text-muted-foreground">
                        Learn how to authenticate API requests
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="bg-muted/10 border-t px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <ShieldIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Secured with 256-bit encryption
            </span>
          </div>
          <a href="#" className="text-xs text-primary hover:underline">
            Privacy Policy
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BankConnection;
