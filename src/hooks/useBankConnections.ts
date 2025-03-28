
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
      
      const { data, error } = await supabase
        .from('bank_connections')
        .select('*')
        .eq('user_id', userData.user.id);
        
      if (error) throw error;
      
      setConnections(data || []);
      return data;
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
      
      // Create a record of the connection
      const { data, error } = await supabase
        .from('bank_connections')
        .insert({
          user_id: userData.user.id,
          bank_id: bankId,
          bank_name: bankName,
          status: "connected",
          last_sync: new Date().toISOString(),
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Bank connected successfully",
        description: `Your ${bankName} account has been connected successfully.`,
      });
      
      await fetchConnections();
      return data;
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
      
      const { error } = await supabase
        .from('bank_connections')
        .update({ status: "disconnected" })
        .eq('id', connectionId);
        
      if (error) throw error;
      
      toast({
        title: "Bank disconnected",
        description: "Your bank account has been disconnected successfully.",
      });
      
      await fetchConnections();
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
      
      // In a real implementation, you would trigger a background job to sync data
      // Here we're just updating the last_sync timestamp
      
      const { error } = await supabase
        .from('bank_connections')
        .update({ 
          last_sync: new Date().toISOString() 
        })
        .eq('id', connectionId);
        
      if (error) throw error;
      
      toast({
        title: "Bank data synchronized",
        description: "Your bank data has been synchronized successfully.",
      });
      
      await fetchConnections();
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
