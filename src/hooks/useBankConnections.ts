
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type BankConnection = {
  id: string;
  user_id: string;
  bank_id: string;
  bank_name: string;
  status: "connected" | "disconnected" | "pending";
  last_sync: string | null;
  created_at: string;
  access_token?: string;
};

export const useBankConnections = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [connections, setConnections] = useState<BankConnection[]>([]);
  const { toast } = useToast();

  const fetchConnections = async () => {
    try {
      setIsLoading(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("User not authenticated");
      }
      
      // For development purposes, we're mocking the bank connections data
      // since the bank_connections table doesn't exist in the database yet
      const mockData: BankConnection[] = [];
      setConnections(mockData);
      return mockData;
    } catch (error: any) {
      toast({
        title: "Failed to fetch bank connections",
        description: error.message,
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const connectBank = async (bankId: string, bankName: string, credentials: { username: string; password: string }) => {
    try {
      setIsLoading(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("User not authenticated");
      }
      
      // In a real implementation, you would securely send these credentials to your backend
      // and use a proper banking API like Plaid, Teller, or MX to establish a connection
      
      // Simulating the bank connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mocking a successful connection
      const mockConnection: BankConnection = {
        id: crypto.randomUUID(),
        user_id: userData.user.id,
        bank_id: bankId,
        bank_name: bankName,
        status: "connected",
        last_sync: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      
      // Update local state with the new connection
      setConnections(prev => [...prev, mockConnection]);
      
      toast({
        title: "Bank connected successfully",
        description: `Your ${bankName} account has been connected successfully.`,
        variant: "default", // Changed from "success" to "default" to match available variants
      });
      
      return mockConnection;
    } catch (error: any) {
      toast({
        title: "Failed to connect bank",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectBank = async (connectionId: string) => {
    try {
      setIsLoading(true);
      
      // Mock disconnection by updating local state
      setConnections(prev => 
        prev.map(conn => 
          conn.id === connectionId 
            ? { ...conn, status: "disconnected" } 
            : conn
        )
      );
      
      toast({
        title: "Bank disconnected",
        description: "Your bank account has been disconnected successfully.",
        variant: "default", // Changed from "success" to "default"
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Failed to disconnect bank",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const syncBankData = async (connectionId: string) => {
    try {
      setIsLoading(true);
      
      // Mock syncing by updating the last_sync timestamp in local state
      setConnections(prev => 
        prev.map(conn => 
          conn.id === connectionId 
            ? { ...conn, last_sync: new Date().toISOString() } 
            : conn
        )
      );
      
      toast({
        title: "Bank data synchronized",
        description: "Your bank data has been synchronized successfully.",
        variant: "default", // Changed from "success" to "default"
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Failed to sync bank data",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    connections,
    isLoading,
    fetchConnections,
    connectBank,
    disconnectBank,
    syncBankData,
  };
};
