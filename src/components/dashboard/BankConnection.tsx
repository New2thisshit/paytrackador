
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge"; // Ensure Badge is imported
import { 
  ArrowRightIcon, 
  BuildingIcon, 
  ChevronsUpDownIcon, 
  CreditCardIcon, 
  DatabaseIcon, 
  KeyIcon,
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
import BankConnectionList from "./BankConnectionList";
import BankConnectionForm from "./BankConnectionForm";
import { useBankConnections } from "@/hooks/useBankConnections";

const banks = [
  {
    id: "chase",
    name: "Chase Bank",
    logo: "/placeholder.svg",
  },
  {
    id: "bofa",
    name: "Bank of America",
    logo: "/placeholder.svg",
  },
  {
    id: "wells",
    name: "Wells Fargo",
    logo: "/placeholder.svg",
  },
  {
    id: "citi",
    name: "Citibank",
    logo: "/placeholder.svg",
  },
  // South African Banks
  {
    id: "nedbank",
    name: "Nedbank",
    logo: "/placeholder.svg",
  },
  {
    id: "standardbank",
    name: "Standard Bank",
    logo: "/placeholder.svg",
  },
  {
    id: "fnb",
    name: "First National Bank (FNB)",
    logo: "/placeholder.svg",
  },
];

const BankConnection = () => {
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bankSearchTerm, setBankSearchTerm] = useState("");
  const { fetchConnections } = useBankConnections();
  
  useEffect(() => {
    fetchConnections();
  }, []);
  
  const handleBankConnect = (bankId: string) => {
    setSelectedBank(bankId);
    setIsDialogOpen(true);
  };
  
  const filteredBanks = bankSearchTerm 
    ? banks.filter(bank => 
        bank.name.toLowerCase().includes(bankSearchTerm.toLowerCase())
      )
    : banks;
  
  const selectedBankDetails = banks.find(bank => bank.id === selectedBank);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BuildingIcon className="h-5 w-5 mr-2 text-primary" />
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
            <BankConnectionList onConnectClick={handleBankConnect} />
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full mt-4">
                  <BuildingIcon className="h-4 w-4 mr-2" />
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
                      value={bankSearchTerm}
                      onChange={(e) => setBankSearchTerm(e.target.value)}
                    />
                    <BuildingIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium mb-2">
                      {bankSearchTerm ? "Search Results" : "Popular Banks"}
                    </h4>
                    
                    {filteredBanks.length > 0 ? (
                      filteredBanks.map((bank) => (
                        <div 
                          key={bank.id}
                          className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-muted/30 transition-colors"
                          onClick={() => handleBankConnect(bank.id)}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded bg-muted/50 flex items-center justify-center mr-3">
                              <BuildingIcon className="h-4 w-4" />
                            </div>
                            <span>{bank.name}</span>
                          </div>
                          <ArrowRightIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-4 border rounded-md bg-muted/5">
                        <p className="text-sm text-muted-foreground">
                          No banks found matching your search. Try a different term.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog 
              open={isDialogOpen && selectedBank !== null} 
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) setSelectedBank(null);
              }}
            >
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    Connect to {selectedBankDetails?.name}
                  </DialogTitle>
                  <DialogDescription>
                    Enter your bank credentials to establish a secure connection.
                    All data is encrypted and transmitted securely.
                  </DialogDescription>
                </DialogHeader>
                
                {selectedBankDetails && (
                  <BankConnectionForm 
                    bankId={selectedBankDetails.id}
                    bankName={selectedBankDetails.name}
                    onSuccess={() => setIsDialogOpen(false)}
                    onCancel={() => setIsDialogOpen(false)}
                  />
                )}
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
